var parser = peg.generate(grammar);
var id = 0;

var input = "{const x=1; var y=2;}";

var tree = parser.parse(input);

var count=0;
var output = evalSMC(new SMC(new Map(),[], new Map(), [tree]));
$("#resultadoOutput").val(  $("#resultadoOutput").val() +"\n\n===============END===============\n");

function evalSMC(smc) {
    count++;
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
            if (atual.operator == "if") {
                smc.organizaIf();
            } else if (atual.operator == "while") {
                smc.organizaWhile();
            } else if (atual.operator == "block") {
                smc.organizaBlock();
            } else if (atual.operator == "decl") {
                smc.organizaDeclaracao();
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

