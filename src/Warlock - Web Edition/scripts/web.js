$( "#button" ).click(function() {
	cy.elements().remove();
	var tree = parser.parse($("#exp").val());

	evalSMC(new SMC([], new Map(), [tree]));

	addNodes(tree);

	var lay = cy.makeLayout({name: 'dagre'});
	lay.run();

});

$( "#reset" ).click(function() {
	var lay = cy.makeLayout({name: 'dagre'});
	lay.run();

});
