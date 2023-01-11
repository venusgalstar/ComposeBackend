
var abiContract = require('./nftABI.json');
var abiContract1 = require('./nftABI1.json');

var config = {
    "HOST"      : "localhost",
    "USER"      : "postgres",
    "PASSWORD"  : "a",
    "DATABASE"  : "bdjuno",
    "PORT"      : 9000,
    "DBPORT"    : 5432,
    "ABI"       : abiContract,
    "ABI1"      : abiContract1,
    "PRIVKEY"   : "943dbdb1dc08353b9f65f1ad3a2d1912740cab1e13f82afb89499b0d55164fa1",
    "PUBLICKEY" : "0xF3E21FFC9dDaE9116d053d02111580A52bdDbD86", 
    "MAINRPC"   : "http://3.142.68.65:8545"
}

module.exports = {config};
