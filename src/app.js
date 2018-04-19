var peg = require("pegjs");
var fs = require("fs");
const SMC = require("./SMC.js");
var http = require('http');

var parser = peg.generate(fs.readFileSync("./grammar.pegjs", 'utf8'));

var tree = parser.parse("2+3*5-1");
var caio = new SMC([], new Map(), []);
caio.inicializa(tree);
caio.resolve();
console.log(caio);








function eval(tree, smc) {


}


