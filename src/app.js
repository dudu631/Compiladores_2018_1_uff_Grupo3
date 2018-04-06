var peg = require("pegjs");
var fs = require("fs");

var parser = peg.generate(fs.readFileSync("./grammar.pegjs", 'utf8'));


console.log("Imprimindo: ");
console.log(parser.parse("{a:=b}"));
console.log(parser.parse("{if ae==ea print(a) else a:=b}"));

