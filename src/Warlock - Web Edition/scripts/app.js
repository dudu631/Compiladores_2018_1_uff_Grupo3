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
            smc.caso3();
            evalSMC(smc);
        } else if (parseInt(atual) > 0) {
            smc.caso1();
            evalSMC(smc);
        } else if (verificarReservado(atual)) {
            smc.caso4(reserved.get(atual));
            evalSMC(smc);
        }       
    }
    return smc;

}

function verificarReservado(key) {
    return reserved.has(key) ? true : false;
}

function add(){
	alert('yupi');
}

