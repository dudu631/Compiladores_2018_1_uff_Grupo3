var reserved = new Map();
reserved.set("add",add);
reserved.set("sub",sub);
reserved.set("div",div);
reserved.set("mul",mul);
reserved.set("eq",eq);
reserved.set("le",le);
reserved.set("lt",lt);
reserved.set("ge",ge);
reserved.set("gt",gt);



function add(a,b){
    return a+b;
}

function sub(a,b){
    return a-b;
}

function div(a,b){
    return a/b;
}

function mul(a,b){
    return a*b;
}

function eq(a,b){
    return a==b;
}

function le(a,b){
    return a<=b;
}

function lt(a,b){
    return a<b;
}

function ge(a,b){
    return a>=b;
}

function gt(a,b){
    return a>b;
}