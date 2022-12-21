import {config} from './config/config.js';
import mysql from 'sync-mysql';

var DB;

const initDB = () =>
{
    console.log("Trying connect to database...\n");
    
    try {
        DB = new mysql({
            host: config.HOST,
            user: config.USER,
            password: config.PASSWORD,
            database: config.DATABASE
        });

    } catch(e){
        console.log("Failed to connect database! Trying again every 1 second. \n", e);
        setTimeout(initDB, 1000);
    }
    
    console.log("Succeed in establishing connection to database.\n");
}

export{ initDB };

const getChainList = () =>
{
    var res;

    console.log("Trying to ChainList from database... \n");

    try{
        var query = "SELECT * FROM chain";
        var result = DB.query(query);

        res = result;
    } catch(e)
    {
        console.log("Failed in getting blocknumber from database.\n", e);
    }
    return res;    
}

export{ getChainList };

const getNftList = () =>
{
    var res;

    console.log("Trying to get NFTList from database... \n");

    try{
        var query = "SELECT * FROM nft";
        var result = DB.query(query);

        res = result;
    } catch(e)
    {
        console.log("Failed in getting blocknumber from database.\n", e);
    }
    return res;    
}

export{ getNftList };

const getLastBlockNumber = () =>
{
    var blockNumber;

    console.log("Trying to get blocknumber from database... \n");

    try{
        var query = "SELECT startBlock FROM config";
        var result = DB.query(query);

        blockNumber = result[0]["startBlock"];
        startNumber = blockNumber;
        
        console.log(startNumber);
    } catch(e)
    {
        console.log("Failed in getting blocknumber from database.\n", e);
    }
    return startNumber;    
}

export{ getLastBlockNumber };

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

export{ updateLastBlockNumber };