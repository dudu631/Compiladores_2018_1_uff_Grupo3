var parser = peg.generate(grammar);
var id = 0;

var input = "{x:=5;y:=1; while ~(x==0){y:=x*y;x:=x-1}}";

var tree = parser.parse(input);

var count=0;
var output = evalSMC(new SMC([], new Map(), [tree]));

function evalSMC(smc) {
    count++;
    console.log("\n")
    console.log("Passo "+count);
    
    console.log(JSON.parse(smc.json()));
    $("#resultadoOutput").val(  $("#resultadoOutput").val() +"\n======================Passo "+count+"============================\n");
    $("#resultadoOutput").val( $("#resultadoOutput").val() + smc.json());

    
    if (smc.C.length > 0) {

        var atual = smc.C[smc.C.length - 1]; //peek stack

        if (atual.hasOwnProperty('operator')) {
            if (atual.operator == "ass") {
                smc.organizaAtribuicao();
            } else if (atual.operator == "if") {
                smc.organizaIf();
            } else if (atual.operator == "while") {
                smc.organizaWhile();
            } else {
                smc.organizaExpressoes();
            }
        
        } else if (verificarReservado(atual)) {
            if (reserved.get(atual) != 0) {
                smc.resolveExpressoes(reserved.get(atual));
            } else {
                smc.resolveComando(atual);
            }
        
        } else{
            smc.caso1();
        }

        evalSMC(smc);
        
    }

    return smc;

}


function verificarReservado(key) {
    return reserved.has(key) ? true : false;
}

