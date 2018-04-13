var peg = require("pegjs");
var fs = require("fs");
const SMC = require("./SMC.js");

var http = require('http');

var parser = peg.generate(fs.readFileSync("./grammar.pegjs", 'utf8'));

var tree = parser.parse("a * b * c");

eval(tree, new SMC([], new Map(), []));

setupServer();

//x.empilhaControle(2);
//x.guardaMemoria("variavel1", 22);

console.log("Imprimindo: ");
//console.log(x.desempilhaControle());

console.log("Imprimindo 2:")
//console.log(x.acessaMemoria("variavel1"));



function eval(tree, smc) {


}

function setupServer() {
    const PORT = 8080;

    fs.readFile('./index.html', function (err, html) {

        if (err) throw err;

        http.createServer(function (request, response) {
            response.writeHeader(200, { "Content-Type": "text/html" });
            response.write(html);
            response.end();
        }).listen(PORT);
    });
}
