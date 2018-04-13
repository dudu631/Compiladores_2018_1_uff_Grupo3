var peg = require("pegjs");
var fs = require("fs");
const SMC = require("./SMC.js");
var http = require('http');

var parser = peg.generate(fs.readFileSync("./grammar.pegjs", 'utf8'));

var tree = parser.parse("a * b * (c-4)");

eval(tree, new SMC([], new Map(), []));

//x.empilhaControle(2);
//x.guardaMemoria("variavel1", 22);

console.log(3 / (5 - 9) / 2);
//console.log(x.desempilhaControle());

console.log("Imprimindo 2:")
//console.log(x.acessaMemoria("variavel1"));

//console.log(2 - 8 / 4 + 5);


function eval(tree, smc) {


}


