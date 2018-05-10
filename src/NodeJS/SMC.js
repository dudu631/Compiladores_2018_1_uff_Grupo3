
class SMC {
    constructor(E, S, M, C) {
        this.E = E;
        this.S = S;
        this.M = M;
        this.C = C;
        this.address = 0;
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

    acessaMemoria(key) {
        //Obtem o endereço da variavel no ambiente
        var loc = this.E.get(key);

        //Busca na memoria o valor
        return this.M.get(loc);
    }

    guardaMemoria(key, x) {

        var loc = this.address;

        if (!this.E.has(key)) {
            //Salva no ambiente o endereco da variavel
            this.E.set(key, this.address);
        } else {
            loc = this.E.get(key);
        }

        //Salva na memoria o valor
        this.M.set(loc, x);

        //Aumenta o contador do endereço
        this.address++;
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
        if (typeof (op) != 'undefined' && op != null && op != "seq") {
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
                second = this.acessaMemoria(second);
            }
            if (!this.isNumber(first) && this.E.has(first)) {
                first = this.acessaMemoria(first);
            }

            if (this.isNumber(first) && this.isNumber(second)) {
                this.empilhaValor(fun(parseInt(first), parseInt(second)));
            } else if (this.isNumber(first) && !this.isNumber(second)) {
                this.empilhaValor(fun(parseInt(first), second));
            } else if (!this.isNumber(first) && this.isNumber(second)){
                this.empilhaValor(fun(first, parseInt(second)));
            } else {
                this.empilhaValor(fun(first, second));
            }
        } else {
            var first = this.desempilhaValor();
            this.empilhaValor(fun(first));
        }
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
        this.guardaMemoria(key, valor);
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

            //========Empilha o ambiente antigo
            //this.empilhaValor(this.E);

            //========Cria um novo, como uma cópia do antigo
            //this.E = new Map(this.E);

            //Como diferenciar a 'entrada' no loop pela primeira vez para criar o ambiente novo, sem criar a cada iteração?
            //Criação de novo token?

            //Como saber que saiu do while/if?
            //token sinalizador de fim do novo bloco?
            
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
            default:
        }
    }

    isNumber(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }

    resolvePrint() {

    }
};

module.exports = SMC;