var reserved = new Map();
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
    if(BigNumber.isBigNumber(a)){

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