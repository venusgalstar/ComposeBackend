import {config} from './config/config.js';
import Web3 from "web3";
import * as database from './database.js';

const monitorContract = async() =>{

    try{
        let chainList = await database.getChainList();
        let nftList = await database.getNftList();

        var idx = 0;

        // console.log(chainList[0]["rpc"]);

        for( idx = 0; idx < nftList.length; idx++ ){

            var rpc = chainList[nftList[idx].chain_id - 1].rpc;

            var web3 = new Web3(new Web3.providers.HttpProvider(rpc)); 

            var contract = new web3.eth.Contract(config.ABI, nftList[idx].chain_contract_addr);

            var startBlockNum = nftList[idx].block_num;

            var currentBlockNumber = await web3.eth.getBlockNumber();

            var endBlockNum = currentBlockNumber;

            if( currentBlockNumber > startBlockNum + 2000 )
                endBlockNum = startBlockNum + 2000;

            await contract.getPastEvents("Transfer",{
                fromBlock: startBlockNum,
                toBlock: endBlockNum,
            }, function(error, event){
    
                console.log("from: ", startBlockNum, endBlockNum, typeof event);
                
                // database.updateLastBlockNumber(endBlockNum);
    
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
    
                for( idx = 0; idx < count; idx++ ){
                    var transaction = [];
                    transaction["timestamp"] = event[idx].blockNumber;
                    transaction["wallet_address"] = event[idx].returnValues[0];
                    // transaction["to_address"] = event[idx].returnValues[1];
                    transaction["busd_amount"] = event[idx].returnValues[3] / 1e18;
                    transaction["transaction_hash"] = event[idx].transactionHash;
                    transactionList.push(transaction);
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



