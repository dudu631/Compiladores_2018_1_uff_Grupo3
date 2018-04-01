class ParserGroovy {

    def space = { return it.matches("\\s+") }

    def line = {return it.matches("\n+")}

    //CORRIGIR
    def blank = {return it.each {space(it)||line(it)} }

    def integer = {return it.matches("[0-9]+")}

    def identifier = {return it.matches("[a-zA-Z]+") }

    def sum_operator = {return it.matches("\\+")}

    def min_operator = {return it.matches("-")}

    def div_operator = {return it.matches("/")}

    def mult_operator = {return it.matches("\\*")}

    def or_operator = {return it.matches("|")}

    def operator = {return sum_operator(it) || min_operator(it) || div_operator(it) || mult_operator(it) || or_operator(it)}

    def bool_operator = {return it.matches("~|==|<=|<|>=|>")}

    //CORRIGIR >>
    def bool_expression = {return identifier >> bool_operator >> identifier}

    //CORRIGIR >>
    def expression = {return identifier || identifier>>operator>>identifier }

}

