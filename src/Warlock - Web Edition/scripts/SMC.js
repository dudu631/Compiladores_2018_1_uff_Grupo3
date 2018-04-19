
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

    //Desempilha do controle, empilha no valor
    caso1() {
        this.empilhaValor(parseInt(this.desempilhaControle()));
    }

    //A OP B  ->  A B OP
    caso3() {
        this.desmembra();
        var left = this.desempilhaControle();
        var op = this.desempilhaControle();
        var right = this.desempilhaControle();
        if (typeof (op) != 'undefined' && op != null) {
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
    caso4() {
        var aux = this.desempilhaControle();
        if (aux == 'add') {
            this.empilhaValor(parseInt(this.desempilhaValor()) + parseInt(this.desempilhaValor()));
        }
        if (aux == 'sub') {
            var second = parseInt(this.desempilhaValor());
            var first = parseInt(this.desempilhaValor());
            this.empilhaValor(first - second);
        }
        if (aux == 'mul') {
            this.empilhaValor(parseInt(this.desempilhaValor()) * parseInt(this.desempilhaValor()));
        }
        if (aux == 'div') {
            var second = parseInt(this.desempilhaValor());
            var first = parseInt(this.desempilhaValor());
            this.empilhaValor(first / second);
        }
    }

   
};


