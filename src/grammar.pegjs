start = program

//Inicialmente um programa é apenas o bloco
program 
	= block?
    
block
	= '{' _ cmd+ _ '}'

cmd 
	= ident ':=' exp
    /if
    /while
    /print

exp
	= ident
    / ident operator ident
    / booleanExp

booleanExp 
	= ident boolOp ident
        
while
	='while' booleanExp block
   
if
	= 'if' _ booleanExp cmd 'else'  _ cmd
    /'if' _ booleanExp cmd 'else' block
    /'if' _ booleanExp block 'else' _ cmd
    /'if' _ booleanExp block 'else block'

print
	=_'print('exp: exp')' _ {return "print("+exp+")"}

bool
	="true" {return true}
	/"false" {return false}

operand "Operando"
	= number / ident

ident 
	=digits:  [a-zA-Z]+  {return digits.join("");}

boolOp
	='~'
    /'=='
    /'<'
    /'<='
    /'>'
    /'>='

operator
	= '*'
    /'+'
    /'/'
    /'-'

number  
	=  _ digits:[0-9]+ _ { return parseInt(digits.join("")); }
    
_ "blank"
	= WhiteSpace*
    / line *
    
WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
    
line  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"
