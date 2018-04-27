var parser = peg.generate(grammar);
var id = 0;

var tree = parser.parse("2*3+5/9");

evalSMC(new SMC([], new Map(), [tree]));

addNodes(tree);

var lay = cy.makeLayout({name: 'dagre'});
lay.run();

function evalSMC(smc) {
    console.log("\n")
    console.log(JSON.parse(JSON.stringify(smc)));

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

        eval(smc);
        
    }

    return smc;

}


function verificarReservado(key) {
    return reserved.has(key) ? true : false;
}


