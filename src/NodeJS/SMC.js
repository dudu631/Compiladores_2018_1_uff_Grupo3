var BigNumber = require('bignumber.js');

class Abs {
    constructor(params, blc) {
        this.params = params;
        this.bloco = blc;
    }
}

class Location {

    constructor(address) {
        this.address = address;
    }

}

class Memory {

    constructor(M) {
        this.M = M;
        this.address = 0;
    }

    acessaMemoria(loc) {
        return this.M.get(loc.address);
    }

    insereMemoria(value) {
        var loc = new Location(this.address);

        //Salva na memoria o valor
        this.M.set(loc.address, value);

        //Aumenta o contador do endereço
        this.address++;

        return loc;
    }

    atualizaMemoria(loc, value) {

        if (this.M.has(loc.address)) {
            this.M.set(loc.address, value);
        }
    }

}

class SMC {
    constructor(E, S, M, C) {
        this.E = E;
        this.S = S;
        this.M = new Memory(M);
        this.C = C;

    }
    setAddress(x) {
        this.address = x;
    }

    empilhaControle(x) {
        this.C.push(x);
    }

    desempilhaControle() {
        return this.C.pop();
    }

    empilhaValor(x) {
        this.S.push(x);
    }

    desempilhaValor() {
        return this.S.pop();
    }

    declaraConstante(ident, value) {

        this.E.set(ident, value);
    }

    declaraVariavel(ident, value) {

        //insere na memoria e obtem a ref
        var loc = this.M.insereMemoria(value);

        //atualiza o ambiente(que ainda esta sendo criado nesse passo) com o identificador e sua Loc
        this.E.set(ident, loc);

    }

    getValorVariavel(ident) {
        //Obtem o endereço da variavel no ambiente
        var loc = this.E.get(ident);

        //Busca na memoria o valor
        return this.M.acessaMemoria(loc);
    }

    atualizaVariavel(key, value) {

        if (this.E.has(key)) {

            var loc = this.E.get(key);

            if (loc instanceof Location) {
                this.M.atualizaMemoria(loc, value);
            } else {
                throw "Não é possível mudar o valor de uma constante."
            }

        } else {
            throw "Variável '" + key.toString() + "' não declarada.";
        }

    }

    //Quebra a arvore e empilha no controle
    desmembra() {
        var tree = this.desempilhaControle();
        this.empilhaControle(tree.right);
        this.empilhaControle(tree.operator);
        this.empilhaControle(tree.left);
    }

    desmembraIf() {
        var tree = this.desempilhaControle();
        this.empilhaControle(tree.adit);
        this.empilhaControle(tree.right);
        this.empilhaControle(tree.operator);
        this.empilhaControle(tree.left);
    }

    //Desempilha do controle, empilha no valor
    caso1() {
        this.empilhaValor(this.desempilhaControle());
    }

    //A OP B  ->  A B OP
    organizaExpressoes() {
        this.desmembra();
        var left = this.desempilhaControle();
        var op = this.desempilhaControle();
        var right = this.desempilhaControle();
        if (typeof (op) != 'undefined' && op != null && op != "seq" && op != "iniSeq" && op != "declSeq") {
            this.empilhaControle(op);
        }
        if (typeof (right) != 'undefined' && right != null) {
            this.empilhaControle(right);
        }
        if (typeof (left) != 'undefined' && left != null) {
            this.empilhaControle(left);
        }
    }

    //Resolve a operação
    resolveExpressoes(fun) {
        var aux = this.desempilhaControle();

        if (aux != "neg") {
            var second = this.desempilhaValor();
            var first = this.desempilhaValor();

            if (!this.isNumber(second) && this.E.has(second)) {
                if (this.E.get(second) instanceof Location)
                    second = this.getValorVariavel(second);
                else
                    second = this.E.get(second);
            }
            if (!this.isNumber(first) && this.E.has(first)) {
                if (this.E.get(first) instanceof Location)
                    first = this.getValorVariavel(first);
                else
                    first = this.E.get(first);
            }

            if (this.isNumber(first) && this.isNumber(second)) {
                this.empilhaValor(fun(BigNumber(first), BigNumber(second)));
            } else if (this.isNumber(first) && !this.isNumber(second)) {
                this.empilhaValor(fun(BigNumber(first), second));
            } else if (!this.isNumber(first) && this.isNumber(second)) {
                this.empilhaValor(fun(first, BigNumber(second)));
            } else {
                this.empilhaValor(fun(first, second));
            }
        } else {
            var first = this.desempilhaValor();
            this.empilhaValor(fun(first));
        }
    }

    organizaProcedure() {
        var tree = this.desempilhaControle();

        //empilha 'prc'
        this.empilhaControle(tree.operator);

        //empilha construcao ABS
        this.empilhaControle(new Abs(tree.right, tree.adit));

        //empilha nome da procedure
        this.empilhaControle(tree.left);


    }

    resolveProcedure() {
        var id = this.desempilhaValor();
        var abs = this.desempilhaValor();

        // salva em E (id:abs)
        this.E.set(id, abs);
    }

    resolveCall() {
        var atuais = this.desempilhaValor();
        var nome = this.desempilhaValor();
        var abs = this.E.get(nome);
        // Checar se a quantidade de atuais bate com a de formals, fazer os formals receberem os valores de atuais e jogar o block na pilha de controle

        // e resolver ele.
        var map = matchParams(atuais,abs.params);


        addDecl();
        
    }

    matchParams(act,param) {

        var map = new Map();

        if (act.operator != 'for') return;

    }

    organizaFor() {
        var arvore = this.desempilhaControle();
        this.empilhaValor(arvore);
    }

    organizaAtribuicao() {
        this.desmembra();
        var left = this.desempilhaControle();
        var op = this.desempilhaControle();
        var right = this.desempilhaControle();
        if (typeof (left) != 'undefined' && left != null) {
            this.empilhaValor(left);
        }
        if (typeof (op) != 'undefined' && op != null && op != "seq") {
            this.empilhaControle(op);
        }
        if (typeof (right) != 'undefined' && right != null) {
            this.empilhaControle(right);
        }
    }

    resolveAtribuicao() {
        var aux = this.desempilhaControle();
        var valor = this.desempilhaValor();
        var key = this.desempilhaValor();
        this.atualizaVariavel(key, valor);
    }

    organizaIf() {
        this.desmembraIf();
        var left = this.desempilhaControle();
        var op = this.desempilhaControle();
        var right = this.desempilhaControle();
        var adit = this.desempilhaControle();
        this.empilhaValor(adit);
        this.empilhaValor(right);
        this.empilhaControle(op);
        this.empilhaControle(left);
    }

    resolveIf() {
        var condIf = this.desempilhaValor();
        var thenIf = this.desempilhaValor();
        var elseIf = this.desempilhaValor();
        var op = this.desempilhaControle();
        if (condIf) {
            this.empilhaControle(thenIf);
        } else {
            this.empilhaControle(elseIf);
        }
    }

    organizaWhile() {
        this.desmembra();
        var left = this.desempilhaControle();
        var op = this.desempilhaControle();
        var right = this.desempilhaControle();
        this.empilhaValor(right);
        this.empilhaValor(left);
        this.empilhaControle(op);
        this.empilhaControle(left);
    }

    resolveWhile() {
        var Vcond = this.desempilhaValor();
        var cond = this.desempilhaValor();
        var doAction = this.desempilhaValor();
        var op = this.desempilhaControle();
        if (Vcond) {
            this.empilhaControle({ left: cond, operator: op, right: doAction });
            this.empilhaControle(doAction);
        }
    }

    resolveComando(cmd) {

        switch (cmd) {
            case "ass":
                this.resolveAtribuicao();
                break;
            case "if":
                this.resolveIf();
                break;
            case "while":
                this.resolveWhile();
                break;
            case "print":
                this.resolvePrint();
                break;
            case "block":
                this.resolveBlock();
                break;
            case "decl":
                this.resolveDeclaracao();
                break;
            case "ini":
                this.resolveIni();
                break;
            default:
        }
    }

    organizaBlock() {

        this.organizaExpressoes();

        this.empilhaValor(this.E == null ? new Map() : this.E);

        this.E = new Map(this.E);
    }

    resolveBlock() {
        //Tira o block do controle
        var dispose = this.desempilhaControle();

        //Retoma o ambiente externo
        this.E = this.desempilhaValor();
    }

    organizaDeclaracao() {

        var tree = this.desempilhaControle();
        //Empilha primeiro para saber quando acabar a Declaracao e assim conseguir remover o varConst da pilha de valor
        this.empilhaControle(tree.operator);

        //Empilha o resto no controle(ini, iniseq)
        this.empilhaControle(tree.right);

        //Empilha o Var ou Const em Valor
        this.empilhaValor(tree.left);

    }

    resolveDeclaracao() {
        //remove o decl de controle
        this.desempilhaControle();

        //remove o varConst de valor
        this.desempilhaValor();
    }

    resolveIni() {
        //Tira o ini da pilha de controle
        this.desempilhaControle();

        //Desempilha da pilha de valor o identificador, seu valor e o controle de var ou const
        var value = this.desempilhaValor();
        var ident = this.desempilhaValor();
        var varConst = this.desempilhaValor();

        if (varConst == "var") {
            this.declaraVariavel(ident, value);
        } else if (varConst == "const") {
            this.declaraConstante(ident, value);
        } else {
            Console.log("======DEBUG==========Erro: Algo deu errado,era esperado 'var' ou 'const' da pilha de valor");
        }

        this.empilhaValor(varConst);
    }

    isNumber(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }

    resolvePrint() {

    }

    json() {

        var temp = this.strMapToObj(this.M.M);
        var ambiente = this.E != null ? this.strMapToObj(this.E) : null;
        var smc = new SMC(ambiente, this.S, temp, this.C);
        return JSON.stringify(smc);
    }

    //Funcao auxiliar para printar o map 
    strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k, v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }
};

module.exports = SMC;