addNodes(tree);

var lay = cy.makeLayout({name: 'dagre'});
lay.run();

$("#codigoInput").val(input);
$("#exp").val(input);


$("#defaultOpen").click();


$( "#gerar" ).click(function() {
	cy.elements().remove();
	try{
		var tree = parser.parse($("#exp").val());

		evalSMC(new SMC([], new Map(), [tree]));

		addNodes(tree);

		var lay = cy.makeLayout({name: 'dagre'});
		lay.run();
		$("#exp").removeClass("is-invalid");
	}catch(error){
		
		$("#exp").addClass("is-invalid");
	}

});

$( "#reset" ).click(function() {
	var lay = cy.makeLayout({name: 'dagre'});
	lay.run();

});

$( "#compilar" ).click(function() {
	input = $("#codigoInput").val();
	$("#resultadoOutput").val("");
	try{
		$("#codigoInput").removeClass("is-invalid");
		tree = parser.parse(input);

		count=0;
		output = evalSMC(new SMC([], new Map(), [tree]));
	}catch(err){
		$("#codigoInput").addClass("is-invalid");
	}
});


function openTab(evt, name) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(name).style.display = "block";
    
}