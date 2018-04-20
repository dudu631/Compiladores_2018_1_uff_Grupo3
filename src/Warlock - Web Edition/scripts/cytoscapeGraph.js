var cy = window.cy = cytoscape({
	container: document.getElementById('cy'),
  
	boxSelectionEnabled: false,
	autounselectify: true,
  
	layout: {
	  name: 'dagre'
	},
  
	style: [
	  {
		selector: 'node',
		style: {
		  'content': 'data(value)',
		  'text-opacity': 0.5,
		  'text-valign': 'center',
		  'text-halign': 'right',
		  'background-color': '#11479e'
		}
	  },
  
	  {
		selector: 'edge',
		style: {
		  'curve-style': 'bezier',
		  'width': 4,
		  'target-arrow-shape': 'triangle',
		  'line-color': '#9dbaea',
		  'target-arrow-color': '#9dbaea'
		}
	  }
	],
  
	});
	

	function addNodes(tree){
		var temp = new Object;
		temp.id = id++;
		temp.value = tree.operator;
		tree.operator =  temp;
		
		cy.add({group: "nodes",
				data: { id: tree.operator.id, value: tree.operator.value }
				});
		
		
		if(isRoot(tree.left)){
			addNodes(tree.left);
			cy.add({ group: "edges", data: { source: tree.operator.id, target: tree.left.operator.id } })		
				
		}else{
			temp = new Object;
			temp.id = id++;
			temp.value = tree.left;
			tree.left =  temp;		
			cy.add({group: "nodes",
				data: { id: tree.left.id , value: tree.left.value}
				});	
			cy.add({ group: "edges",data: { source: tree.operator.id, target: tree.left.id } })			
		}
	
		if(isRoot(tree.right)){
			addNodes(tree.right);
			cy.add({ group: "edges", data: { source: tree.operator.id, target: tree.right.operator.id } })	
		}else{
			temp = new Object;
			temp.id = id++;
			temp.value = tree.right;
			tree.right =  temp;		
			
			cy.add({group: "nodes",
			data: { id: tree.right.id, value:tree.right.value }
			});
			cy.add({ group: "edges", data: { source: tree.operator.id, target: tree.right.id } })			
		}
	
	
	};

	function isRoot(x){
		if(x.hasOwnProperty('operator')){
			return true;
		}
		return false;
	};
	