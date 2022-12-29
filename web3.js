import {config} from './config/config.js';
import Web3 from "web3";
import * as database from './database.js';
import shell from 'shelljs';

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
                var idx_n;
    
                if( count == 0 ){
                    return;
                }
   
                console.log("event", event);

                for( idx_n = 0; idx_n < count; idx_n++ ){
                    var transaction = [];
                    transaction["timestamp"] = event[idx_n].blockNumber;
                    transaction["from"] = event[idx_n].returnValues[0];
                    transaction["to"] = event[idx_n].returnValues[1];
                    transaction["id"] = event[idx_n].returnValues[2] ;
                    transaction["transaction_hash"] = event[idx_n].transactionHash;

                    if( transaction["from"] != "0x0000000000000000000000000000000000000000" ){
                        var script = "composed tx bank send " + transaction['from'] + " " + transaction['to'] + " 100pose -y";

                        console.log("script", script);

                        shell.exec(script);
                    }
                }
            });

        }
    } catch(e){
        console.log(e);
    }
    
    setTimeout(monitorContract, 1000);

}
export {monitorContract};



