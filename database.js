var {config} = require('./config/config.js');
const { Pool } = require('pg');
// require('dotenv').config()

var DB;

const initDB = () =>
{
    console.log("Trying connect to database...\n");
    console.log("config.PASSWORD", config.USER);

    try {
        DB = new Pool({
            user: config.USER,
            database: config.DATABASE,
            password: config.PASSWORD,
            port: config.DBPORT,
            host: config.HOST,
          });

    } catch(e){
        console.log("Failed to connect database! Trying again every 1 second. \n", e);
        setTimeout(initDB, 1000);
    }
    
    console.log("Succeed in establishing connection to database.\n");
}

const getChainList = async() =>
{
    var res;

    console.log("Trying to ChainList from database... \n");

    try{
        var query = "SELECT * FROM chain";
        var result = await DB.query(query);

        res = result.rows;

        // console.log(result);

    } catch(e)
    {
        console.log("Failed in getting chainlist from database.\n", e);
    }
    return res;    
}

const getNftList = async() =>
{
    var res;

    console.log("Trying to get NFTList from database... \n");

    try{
        var query = "SELECT * FROM nft";
        var result = await DB.query(query);

        res = result.rows;
    } catch(e)
    {
        console.log("Failed in getting blocknumber from database.\n", e);
    }
    return res;    
}

const updateLastBlockNumber = (blockNumber, nftId) =>
{
    console.log("Trying to update blocknumber from database... \n");

    try{
        var query = "UPDATE nft SET block_num = "+ blockNumber + " WHERE id ="+nftId;
        var result = DB.query(query);
    } catch(e)
    {
        console.log("Failed in update blockNumber to database.\n", e);
    } 
}

module.exports = { initDB, getChainList, getNftList, updateLastBlockNumber };

// const initDB = () =>
// {
// }

// export{ initDB };

// const getChainList = () =>
// {
//     var res=[];
//     var item=[];
//     item["id"] = 1;
//     item["name"] = "goerli";
//     item["rpc"] = "https://goerli.infura.io/v3/57b59f4ada61437eb6c386afae37ec80";
//     item["explorer"] = "https://goerli.etherscan.io/tx/";

//     res[0] = item;

//     console.log("Trying to ChainList from database... \n");

//     return res;    
// }

// export{ getChainList };

// var blockNumber = 0;

// const getNftList = () =>
// {
//     var res=[];
//     var item=[];
//     item["id"] = 1;
//     item["chain_id"] = 5;
//     item["chain_contract_addr"] = "0x03E67B129E6Ef71026002f9423b1143129065e26";
    
//     if( blockNumber == 0 )
//         item["block_num"] = 8220000;
//     else
//         item["block_num"] = blockNumber;

//     res[0] = item;

//     console.log("Trying to get NFTList from database... \n");

//     return res;    
// }

// export{ getNftList };

// const updateLastBlockNumber = (newBlockNumber, nftId) =>
// {
//     console.log("Trying to update blocknumber from database... \n");

//     blockNumber = newBlockNumber;
// }

// export{ updateLastBlockNumber };