
class SMC {
    constructor(S, M, C) {
        this.S = S;
        this.M = M;
        this.C = C;
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
        return this.M.get(key);
    }

    guardaMemoria(key, x) {
        this.M.set(key, x);
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
    caso3Expressoes() {
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
    caso4Expressoes(fun) {
        var aux = this.desempilhaControle();
        var second = parseInt(this.desempilhaValor());
        var first = parseInt(this.desempilhaValor());
        this.empilhaValor(fun(first, second));
    }

    caso3Ass() {
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

    caso4Ass() {
        var aux = this.desempilhaControle();
        var valor = this.desempilhaValor();
        var key = this.desempilhaValor();
        this.guardaMemoria(key, valor);
    }

    caso3If() {
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

    caso4If() {
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

    case3While() {
        this.desmembra();
        var left = this.desempilhaControle();
        var op = this.desempilhaControle();
        var right = this.desempilhaControle();
        this.empilhaValor(right);
        this.empilhaValor(left);
        this.empilhaControle(op);
        this.empilhaControle(left);
    }

    case4While() {
        var Vcond = this.desempilhaValor();
        var cond = this.desempilhaValor();
        var doAction = this.desempilhaValor();
        var op = this.desempilhaControle();
        if (Vcond) {
            this.empilhaControle(doAction);
            this.empilhaControle(cond);
            this.empilhaControle(op);
            this.empilhaControle(doAction);
        }
    }
   
};

module.exports = SMC;