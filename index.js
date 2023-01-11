var {config} = require('./config/config.js');
var {monitorContract} =require('./web3.js');
var {initDB, getChainList, getNftList} =require('./database.js');

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

// init database
initDB();

// start to monitor
monitorContract();

var app = express();

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.get('/getChainList', async function (req, res){

    var result = getChainList();

    res.json(result);
});

app.get('/getNftList', async function (req, res){

    var resultA = getNftList();

    res.json(resultA);
});

app.listen(config.PORT);