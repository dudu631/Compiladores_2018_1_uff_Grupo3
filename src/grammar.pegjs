start = program

program 
	= exp*
    
exp
	= operando operator exp 
    / booleanExp
    / operando 

booleanExp 
	= operando boolOp booleanExp

bool
	="true" {return true}
	/"false" {return false}

operando "Operando"
	= number / ident

ident 
	= _ head: [a-zA-Z] tail:[a-zA-Z0-9]* _  {return head.concat(tail.join(""));}

boolOp
	='~'
    /'=='
    /'<'
    /'<='
    /'>'
    /'>='

operator
	= '*' {return "mul"}
    /'+' {return "add"}
    /'/' {return "div"}
    /'-' {return "sub"}

number  
	=  _ digits:[0-9]+ _ { return parseInt(digits.join("")); }

// optional whitespace
_  = [ \t\r\n]*

// mandatory whitespace
__ = [ \t\r\n]+


//=========================== OLD

block
	= '{' ident+ '}'
    
cmd 
	=  ident _ ':=' _ exp
    / if
    /while
    /print
    
while
	= _ 'while' _ booleanExp _ block _
   
if
	= _'if' _ booleanExp cmd 'else'  _ cmd
    / _'if' _ booleanExp cmd 'else' block
    / _'if' _ booleanExp block 'else' _ cmd
    / _'if' _ booleanExp block 'else block'

print
	=_'print('exp: exp')' _ {return "print("+exp+")"}
