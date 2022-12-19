import {config} from './config/config.js';
import mysql from 'sync-mysql';

var startNumber = config.START_BLOCKNUM;
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
