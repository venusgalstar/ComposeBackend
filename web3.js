import {config} from './config/config.js';
import Web3 from "web3";
import * as database from './database.js';

const globalWeb3 = new Web3(new Web3.providers.HttpProvider(config.NET_RPC)); 
const mainContract = new globalWeb3.eth.Contract(config.CONTRACT_ABI, config.CONTRACT_ADDR);
const tokenContract = new globalWeb3.eth.Contract(config.TOKEN_ABI, config.TOKEN_ADDR);
var startNumber = 0;

var CurrentBlockNumber = await globalWeb3.eth.getBlockNumber();

export{CurrentBlockNumber};
// let info = await mainContract.methods.Delevoper.call().call();
// console.log("info```````", info);

const monitorContract = async() =>{

    if( startNumber == 0 ){
        startNumber = Math.round(database.getLastBlockNumber());
    }

    try{
        var currentNumber = await globalWeb3.eth.getBlockNumber();
        CurrentBlockNumber = currentNumber;

        if( currentNumber >= startNumber + 2000 )
            currentNumber = startNumber + 2000;

        await mainContract.getPastEvents("Action",{
            fromBlock: startNumber,
            toBlock: currentNumber,
        }, function(error, event){

            console.log("from: ", startNumber, currentNumber, typeof event);
            startNumber = currentNumber;
            database.updateLastBlockNumber(currentNumber);

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

            database.insertTransaction(transactionList);
        });

        // await Web3.eth.getPastLogs({
        //     address : config.
        // })
    } catch(e){
        console.log(e);
    }
    
    setTimeout(monitorContract, 1000);

}
export {monitorContract};



