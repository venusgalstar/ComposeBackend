var {config} = require('./config/config.js');
var Web3 = require("web3");
var {initDB, getChainList, getNftList, updateLastBlockNumber} =require('./database.js');
var shell = require('shelljs');
 var bigNumber = require('bignumber.js');


//composed tx bank send pose1uekktqqhk45vl0h8s4t33pk2l7eksg2ergwua2 pose1nmh7qp0uk3zp4mj3me0x7fm5kcsqac9c2ch8gw 10pose -y

var mainWeb3 = new Web3(new Web3.providers.HttpProvider(config.MAINRPC));

const sendCurrencyTx = async (account, to) => {

    var gasPrice = await mainWeb3.eth.getGasPrice();
    var amount = await mainWeb3.eth.getBalance(account);
    
    gasPrice = mainWeb3.utils.toHex(gasPrice);

    var gasFee = gasPrice * 2100000;

    amount = 1;

    // console.log("balance is", bigNumber(amount), bigNumber(gasFee));

    // amount = bigNumber(amount).minus(bigNumber(gasFee));

    // console.log("balance is", amount.toString(10), amount.toString(10));

    const option = {
        from: account,
        to: to,
        gas: 210000,
        gasPrice,
        value: mainWeb3.utils.toWei(amount.toString(), 'ether'),//amount.toString(10), //
        // nonce,
        chain: await mainWeb3.eth.getChainId(),
        hardfork: 'berlin'
    };
    const signedTx = await mainWeb3.eth.accounts.signTransaction(option, config.PRIVKEY
    ).catch(e => e.message);
    const receipt = await mainWeb3.eth.sendSignedTransaction(signedTx.rawTransaction).catch(e => e.message); //error

    console.log(receipt);
    
    return receipt;
}

const sendTransaction = async(account, to, nftID, contract_addr) => {

    console.log("from", account);
    console.log("to", to);
    console.log("nftID", nftID);
    console.log("contract_addr", contract_addr);

    var gas = 0x16706;
    var gasPrice = 0x5d21dba00;

    var contract1 = new mainWeb3.eth.Contract(config.ABI1, contract_addr);
    var tx;

    var nonce = await mainWeb3.eth.getTransactionCount(contract_addr);
    nonce = mainWeb3.utils.toHex(nonce + 1);

    console.log(nonce);

    if( account == "0x0000000000000000000000000000000000000000" ){
        tx = contract1.methods.mint(to, nftID);
    } else{
        tx = contract1.methods.safeTransferFrom(account, to, nftID);
    }

    const data = tx.encodeABI();

    const option = {
        // from: config.address,
        to: config.PUBLICKEY,
        data: data,
        gas: gas,
        gasPrice: gasPrice,
        // nonce: nonce + 1,
        chain: await mainWeb3.eth.getChainId(),
        hardfork: 'berlin'
    };

    console.log("signing...");
    const signedTx = await mainWeb3.eth.accounts.signTransaction(option, config.PRIVKEY
    ).catch(e => e.message);

    console.log("sending...");
    const receipt = await mainWeb3.eth.sendSignedTransaction(signedTx.rawTransaction).catch(e => e.message); //error

    console.log(receipt);
}

const monitorContract = async() =>{

    try{
        let chainList = await getChainList();
        let nftList = await getNftList();

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

            if( currentBlockNumber <= startBlockNum )
                continue;

            await contract.getPastEvents("Transfer",{
                fromBlock: startBlockNum,
                toBlock: endBlockNum,
            }, function(error, event){
    
                console.log("from: ", startBlockNum, endBlockNum, nftList[currentIdx].chain_id);
                
                updateLastBlockNumber(endBlockNum + 1, nftList[currentIdx].id);
    
                if( event == undefined || event == null ){
                    return;
                }
    
                var count = Object.keys(event).length;
                var idx_n;
    
                if( count == 0 ){
                    return;
                }
   
                // console.log("event", event);

                for( idx_n = 0; idx_n < count; idx_n++ ){
                    var transaction = [];
                    transaction["timestamp"] = event[idx_n].blockNumber;
                    transaction["from"] = event[idx_n].returnValues[0];
                    transaction["to"] = event[idx_n].returnValues[1];
                    transaction["id"] = event[idx_n].returnValues[2];
                    transaction["transaction_hash"] = event[idx_n].transactionHash;

                    // if( transaction["from"] != "0x0000000000000000000000000000000000000000" ){
                    //     // var script = "composed tx bank send " + transaction['from'] + " " + transaction['to'] + " 100pose -y";

                    //     // console.log("script", script);

                    //     // shell.exec(script);

                    //     sendCurrencyTx(transaction["from"], transaction["to"]);
                    // }

                    sendTransaction(transaction["from"], transaction["to"],transaction["id"], nftList[currentIdx].contract_addr);
                }
            });

        }
    } catch(e){
        console.log(e);
    }
    
    setTimeout(monitorContract, 1000);

}
module.exports = {monitorContract};



