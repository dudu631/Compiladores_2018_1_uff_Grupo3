{ 
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

Start = E1

E1 = v:(E2 (add / sub))* rest:E2
     { return leftAssoc(v, rest); }

E2 = v:(primary (mul / div))* rest:primary
     { return leftAssoc(v, rest); }
 
primary
  = number
  / ident
  /BracketedExpression

BracketedExpression
  =	"("expression:E1")"  { return expression }

number
  = _ digits:[0-9]+ _  { return digits.join(""); }

ident 
    = _ head: [a-zA-Z] tail:[a-zA-Z0-9]*  _ {return head.concat(tail.join(""));}


add
    = "+" { return "add" }

sub
    = "-" { return "sub" }

mul 
    = "*" {return "mul"}

div 
    = "/" {return "div"}

// optional whitespace
_  = [ \t\r\n]*

// mandatory whitespace
__ = [ \t\r\n]+