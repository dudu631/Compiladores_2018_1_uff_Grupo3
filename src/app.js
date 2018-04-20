var peg = require("pegjs");
var fs = require("fs");
const SMC = require("./SMC.js");

var reserved = new Map();
init();

var parser = peg.generate(fs.readFileSync("./grammar.pegjs", 'utf8'));
var tree = parser.parse("2+3+2");
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
            smc.caso4(reserved.get(atual));
            eval(smc);
        }
        
    }

    return smc;

}

function verificarReservado(key) {
    return reserved.has(key) ? true : false;
}




// Primitive functions
function init() {
    reserved.set("add", add);
    reserved.set("sub", sub);
    reserved.set("div", div);
    reserved.set("mul", mul);
    reserved.set("eq", eq);
    reserved.set("le", le);
    reserved.set("lt", lt);
    reserved.set("ge", ge);
    reserved.set("gt", gt);
}

function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

function div(a, b) {
    return a / b;
}

function mul(a, b) {
    return a * b;
}

function eq(a, b) {
    return a == b;
}

function le(a, b) {
    return a <= b;
}

function lt(a, b) {
    return a < b;
}

function ge(a, b) {
    return a >= b;
}

function gt(a, b) {
    return a > b;
}

