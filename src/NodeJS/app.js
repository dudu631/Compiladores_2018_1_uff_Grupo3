var peg = require("pegjs");
var fs = require("fs");
const SMC = require("./SMC.js");

var reserved = new Map();
init();

var parser = peg.generate(fs.readFileSync("./grammar.pegjs", 'utf8'));
var tree = parser.parse("{x:=1; if (x==0){x:=0;y:=1;} else {x:=3; } }");
var final = eval(new SMC(null, [], new Map(), [tree]));

function eval(smc) {
    console.log("\n")
    console.log(smc);

    if (smc.C.length > 0) {

        var atual = smc.C[smc.C.length - 1]; //peek stack

        if (atual.hasOwnProperty('operator')) {
            if (atual.operator == "ass") {
                smc.organizaAtribuicao();
            } else if (atual.operator == "if") {
                smc.organizaIf();
            } else if (atual.operator == "while") {
                smc.organizaWhile();
            } else if (atual.operator == "block") {
                smc.organizaBlock();
            } else {
                smc.organizaExpressoes();
            }
        } else if (verificarReservado(atual)) {
            if (reserved.get(atual) != 0) {
                smc.resolveExpressoes(reserved.get(atual));
            } else {
                smc.resolveComando(atual);
            }
        } else {
            smc.caso1();
        }
        eval(smc);
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
    reserved.set("neg", neg);
    reserved.set("ass", 0);
    reserved.set("if", 0);
    reserved.set("while", 0);
    reserved.set("print", 0);
    reserved.set("and", and);
    reserved.set("or", or);
    reserved.set("block", 0);
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

function neg(a) {
    return !a;
}

function and(a, b) {
    return a && b;
}

function or(a, b) {
    return a || b;
}