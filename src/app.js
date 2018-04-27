var peg = require("pegjs");
var fs = require("fs");
const SMC = require("./SMC.js");

var reserved = new Map();
init();

var parser = peg.generate(fs.readFileSync("./grammar.pegjs", 'utf8'));
var tree = parser.parse("{x:=5;y:=1; while ~(x==0){y:=x*y;x:=x-1}}");
var final = eval(new SMC([], new Map(), [tree]));

function eval(smc) {
    console.log("\n")
    console.log(smc);

    if (smc.C.length > 0) {

        var atual = smc.C[smc.C.length - 1]; //peek stack

        if (atual.hasOwnProperty('operator')) {
            if (atual.operator == "ass") {
                smc.caso3Ass();
            } else if (atual.operator == "if") {
                smc.caso3If();
            } else if (atual.operator == "while") {
                smc.caso3While();
            } else {
                smc.caso3Expressoes();
            }
            eval(smc);

        } else if (verificarReservado(atual)) {
            if (reserved.get(atual) != 0) {
                smc.caso4Expressoes(reserved.get(atual));
            } else if (atual == "ass") {
                smc.caso4Ass();
            } else if (atual == "if") {
                smc.caso4If();
            } else {
                smc.caso4While();
            }
            eval(smc);
        } else{
            smc.caso1();
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
    reserved.set("neg", neg);
    reserved.set("ass", 0);
    reserved.set("if", 0);
    reserved.set("while", 0);
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