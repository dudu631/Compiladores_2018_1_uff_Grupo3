﻿{ 
    function leftAssoc(rest, val) {
        if (!rest.length) return val;
        var last = rest.pop();
        return {left:leftAssoc(rest, last[0]), operator:last[1], right:val};
    }
    function rightAssoc(val, rest) {
        if (!rest.length) return val;
        var first = rest.shift();
        return {left:val, operator:first[0], right:rightAssoc(first[1], rest)};
    }   
}
Start = Block?
Block= _"{"_ l:DeclSeq?  r:Sequence? _"}"_ {return {left:l,operator:"block",right:r}}

Sequence =	  
	 l:Command op:';' r:Sequence { return {left:l,operator:"seq",right:r}; }     
     / l:Command ';'? {return l}
     / l:DeclSeq ';' r:Sequence { return{left:l,operator:"block",right:r};}
     / l:DeclSeq ';'  { return{left:l,operator:"block",right:null};}
     
Command =
	Assignment
    /If
	/While
DeclSeq=
	l:Declaration';' r:DeclSeq{return {left:l,operator:'declSeq',right:r}}
    /v:Declaration ';' {return v}
Declaration =
	l:declop __ r:IniSeq {return {left:l,operator:'decl',right:r}}
IniSeq =
	l:Ini',' r:IniSeq {return {left:l,operator:'iniSeq',right:r}}
    /Ini 
Ini =
	l:ident op:'=' r:primary {return {left:l,operator:'ini',right:r}}
 
If =
	_ op:"if" __  l:BoolExpression r:Command "else" a:Command {return{left:l,operator:op.trim(),right:r,adit:a}}
    /_ op:"if" __ l:BoolExpression r:Command "else" a:Block {return{left:l,operator:op.trim(),right:r,adit:a}}
    /_ op:"if" __ l:BoolExpression r:Block "else" a:Command {return{left:l,operator:op.trim(),right:r,adit:a}}
    /_ op:"if" __ l:BoolExpression r:Block "else" a:Block {return{left:l,operator:op.trim(),right:r,adit:a}}
    
While =
	_ op:"while" __ l:BoolExpression r:Block {return {left:l,operator:op.trim(),right:r}}
    
Expression
	=  BoolExpression
    / AritExpression
   
BoolExpression
	= "("? l:AritExpression op:boolop r:AritExpression ")"? {return {left:l,operator:op,right:r}}    
	/ Negate
    
Negate 
	= v:neg rest:BoolExpression {return {left:rest, operator:v, right:null}}
    
AritExpression
	= E1
E1 = v:(E2 (add / sub))* rest:E2
     { return leftAssoc(v, rest); }
E2 = v:(primary (mul / div))* rest:primary
     { return leftAssoc(v, rest); }
 
Assignment
	= l: ident op:":=" r:Expression {return {left:l, operator:"ass", right:r}}
     
primary
  = number
  / ident
  /BracketedExpression
  
BracketedExpression
  =	_ "("expression:Expression")" _  { return expression }
  
number
  = _ digits:[0-9]+ _  { return digits.join(""); }
  
ident 
    = _ head: [a-zA-Z] tail:[a-zA-Z0-9]*  _ {return head.concat(tail.join(""));}
    
boolop
	= "==" { return "eq" }
    / ">=" { return "ge" }
    / ">" {	return "gt" }
    / "<=" {return "le" }
    / "<" {return "lt" }
	/ "&&" {return "and"}
    / "||" {return "or"}
    
neg
	= _"~"_ {return "neg"}
add
    = "+" { return "add" }
sub
    = "-" { return "sub" }
mul 
    = "*" {return "mul"}
div 
    = "/" {return "div"}
declop
    =_"const" {return "const"}
    /_"var" {return "var"}
    
// optional whitespace
_  = [ \t\r\n]*
// mandatory whitespace
__ = [ \t\r\n]+