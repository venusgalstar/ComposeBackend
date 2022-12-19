// var {config} = require('./config/config.js');
import {config} from './config/config.js';
// import * as web3 from './web3.js';
import * as database from './database.js';


import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const router = express.Router();

// init database
await database.initDB();

// start to monitor
web3.monitorContract();

var app = express();

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.get('/getChainList', async function (req, res){

    var result = database.getChainList();

    res.json(result);
});

app.get('/getNftList', async function (req, res){

    var resultA = database.getNftList();

    res.json(resultA);
});

app.listen(config.PORT);