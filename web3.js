import {config} from './config/config.js';
import Web3 from "web3";
import * as database from './database.js';

//composed tx bank send pose1uekktqqhk45vl0h8s4t33pk2l7eksg2ergwua2 pose1nmh7qp0uk3zp4mj3me0x7fm5kcsqac9c2ch8gw 10pose -y

const monitorContract = async() =>{

    try{
        let chainList = await database.getChainList();
        let nftList = await database.getNftList();

        var idx = 0;

        for( idx = 0; idx < nftList.length; idx++ ){

            var rpc = chainList[nftList[idx].chain_id - 1].rpc;

            var web3 = new Web3(new Web3.providers.HttpProvider(rpc)); 

            var contract = new web3.eth.Contract(config.ABI, nftList[idx].chain_contract_addr);

            var startBlockNum = nftList[idx].block_num;

            var currentBlockNumber = await web3.eth.getBlockNumber();

            var endBlockNum = currentBlockNumber;

            var currentIdx = idx;

            if( currentBlockNumber > startBlockNum + 2000 )
                endBlockNum = startBlockNum + 2000;

            await contract.getPastEvents("Transfer",{
                fromBlock: startBlockNum,
                toBlock: endBlockNum,
            }, function(error, event){
    
                console.log("from: ", startBlockNum, endBlockNum, nftList[currentIdx].chain_id);
                
                database.updateLastBlockNumber(endBlockNum, nftList[currentIdx].id);
    
                if( event == undefined || event == null ){
                    return;
                }
    
                var count = Object.keys(event).length;
    
                if( count == 0 ){
                    return;
                }
    
                console.log("new event", count);
                var idx;
                var transactionList = [];
   
                console.log("event", event);

                for( idx = 0; idx < count; idx++ ){
                    var transaction = [];
                    transaction["timestamp"] = event[idx].blockNumber;
                    transaction["from"] = event[idx].returnValues[0];
                    transaction["to"] = event[idx].returnValues[1];
                    transaction["id"] = event[idx].returnValues[2] ;
                    transaction["transaction_hash"] = event[idx].transactionHash;

                    if( transaction["from"] != "0x0000000000000000000000000000000000000000" ){
                        transactionList.push(transaction);
                    }
                }
    
                console.log(transactionList);
    
                // database.insertTransaction(transactionList);
            });

        }
    } catch(e){
        console.log(e);
    }
    
    setTimeout(monitorContract, 1000);

}
export {monitorContract};



