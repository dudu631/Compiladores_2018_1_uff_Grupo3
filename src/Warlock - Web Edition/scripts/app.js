var reserved = new Map();
reserved.set("add", '+');
reserved.set("mul", '*');
reserved.set("div", '/');
reserved.set("sub", '-');

var parser = peg.generate(grammar);
var id = 0;

var tree = parser.parse("2*3+5/9");
debugger;
evalSMC(new SMC([], new Map(), [tree]));

addNodes(tree);

var lay = cy.makeLayout({name: 'dagre'});
lay.run();

function evalSMC(smc) {
    console.log("\n")
    console.log(smc);

    if (smc.C.length > 0) {

        var atual = smc.C[smc.C.length - 1]; //peek stack

        if (atual.hasOwnProperty('operator')) {
            smc.caso3();
            evalSMC(smc);
        } else if (parseInt(atual) > 0) {
            smc.caso1();
            evalSMC(smc);
        } else if (verificarReservado(atual)) {
            smc.caso4();
            evalSMC(smc);
        }       
    }
    return smc;

}

function verificarReservado(key) {
    return reserved.has(key) ? true : false;
}

function isRoot(x){
	if(x.hasOwnProperty('operator')){
		return true;
	}
	return false;
};

$( "#button" ).click(function() {
	cy.elements().remove();
	var tree = parser.parse($("#exp").val());

	eval(tree, new SMC([], new Map(), []));

	addNodes(tree);

	var lay = cy.makeLayout({name: 'dagre'});
	lay.run();

});
