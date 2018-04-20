var peg = require("pegjs");
var fs = require("fs");
const SMC = require("./SMC.js");
var http = require('http');

var reserved = new Map();
reserved.set("add", '+');
reserved.set("mul", '*');
reserved.set("div", '/');
reserved.set("sub", '-');
reserved.set("gt", '>=');
reserved.set("ge", '>');
reserved.set("le", '<=');
reserved.set("lt", '<');
reserved.set("eq", '==');


var parser = peg.generate(fs.readFileSync("./grammar.pegjs", 'utf8'));

var tree = parser.parse("2+2");

var final = eval(new SMC([], new Map(), [tree]));




function eval(smc) {
    console.log("\n")
    console.log(smc);

    if (smc.C.length > 0) {

        var atual = smc.C[smc.C.length - 1]; //peek stack
        if (atual.hasOwnProperty('operator')) {
            smc.caso3();
            eval(smc);
        } else if (parseInt(atual) > 0) {
            smc.caso1();
            eval(smc);
        } else if (verificarReservado(atual)) {
            smc.caso4();
            eval(smc);
        }
        
    }

    return smc;

}

function verificarReservado(key) {
    return reserved.has(key) ? true : false;
}


