var peg = require("pegjs");
var fs = require("fs");
const SMC = require("./SMC.js");
var BigNumber = require('bignumber.js');

var reserved = new Map();
init();

var parser = peg.generate(fs.readFileSync("./grammar.pegjs", 'utf8'));
var tree = parser.parse("module Fact{ var y = 1; proc teste(x){ return 2+2; }; y:=teste(5); print: y;}");
var final = eval(new SMC(new Map(), [], new Map(), [tree]));

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
            } else if (atual.operator == "decl") {
                smc.organizaDeclaracao();
            } else if (atual.operator == "for" || atual.operator=="par") {
                smc.organizaFor();
            } else if (atual.operator == "prc") {
                smc.organizaProcedure();
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
    return reserved.has(key);
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
    reserved.set("decl", 0);
    reserved.set("ini", 0);
    reserved.set("iniSeq", 0);
    reserved.set("declSeq", 0);
    reserved.set("cal", 0);
    reserved.set("prc", 0);
    reserved.set("prt", 0);
    reserved.set("ret", 0);
}

function add(a, b) {
    return a.plus(b);
}

function sub(a, b) {
    return a.minus(b);
}

function div(a, b) {
    return a.dividedBy(b);
}

function mul(a, b) {
    return a.multipliedBy(b);
}

function eq(a, b) {
    return a.isEqualTo(b);
}

function le(a, b) {
    return a.isLessThanOrEqualTo(b);
}

function lt(a, b) {
    return a.isLessThan(b);
}

function ge(a, b) {
    return a.isGreaterThanOrEqualTo(b);
}

function gt(a, b) {
    return a.isGreaterThan(b);
}

function neg(a) {
    if (BigNumber.isBigNumber(a)) {

        return a.negated();

    }
    return !a;
}

function and(a, b) {
    return a && b;
}

function or(a, b) {
    return a || b;
}
