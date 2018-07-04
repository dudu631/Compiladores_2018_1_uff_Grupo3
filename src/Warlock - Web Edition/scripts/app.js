var parser = peg.generate(grammar);
var id = 0;

//FACT
//module Fact{ var y = 1; proc teste(x){ if ~(x==0){var z=x-1; y:=y*x; teste(z);}else{ print: y;} }; teste(3);}

//RETURN
//module Fact{ var y = 1; proc teste(x){ return 2+2; }; y:=teste(5); print: y;}
var input = "module Fact{ var y = 1; proc teste(x){ if ~(x==0){var z=x-1; y:=y*x; teste(z);}else{ print: y;} }; teste(3);}";

var tree = parser.parse(input);

var count=0;
var output = evalSMC(new SMC(new Map(),[], new Map(), [tree]));
$("#resultadoOutput").val(  $("#resultadoOutput").val() +"\n\n===============END===============\n");

function evalSMC(smc) {
    count++;
    if (smc.C.length <= 0) {smc.M.M=new Map();}
    console.log("\n")
    console.log("Passo "+count);    
    
    console.log(JSON.parse(smc.json()));
    $("#resultadoOutput").val(  $("#resultadoOutput").val() +"\n\n==============Passo "+count+"==============\n");
    var ambiente = smc.E != null ? smc.strMapToObj(smc.E) : null;
    $("#resultadoOutput").val( $("#resultadoOutput").val() +">E: " +JSON.stringify(ambiente))
    $("#resultadoOutput").val( $("#resultadoOutput").val() +"\n>S: " +JSON.stringify(smc.S));
    $("#resultadoOutput").val( $("#resultadoOutput").val() +"\n>M: " +JSON.stringify(smc.strMapToObj(smc.M.M)));
    $("#resultadoOutput").val( $("#resultadoOutput").val() +"\n>C: " +JSON.stringify(smc.C));
    
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
        evalSMC(smc);

    }
    
    return smc;

}


function verificarReservado(key) {
    return reserved.has(key);
}

