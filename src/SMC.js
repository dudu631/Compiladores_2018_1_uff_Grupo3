
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

    inicializa(tree) {
        this.empilhaControle(tree.right);
        this.empilhaControle(tree.operator);
        this.empilhaControle(tree.left);
    }

    inicializa1(left, op, right) {
        this.empilhaControle(right);
        this.empilhaControle(op);
        this.empilhaControle(left);
    }

    caso1() {
        this.empilhaValor(this.desempilhaControle());
    }

    caso3() {
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

    resolve() {
        while (this.C.length != 0) {
            this.caso3();
            if (parseInt(this.C[this.C.length - 1]) > 0) {
                this.caso1();
            } else {
                if (this.C[this.C.length - 1] == 'add' || this.C[this.C.length - 1] == 'sub' || this.C[this.C.length - 1] == 'mul' || this.C[this.C.length - 1] == 'div') {
                    this.caso4();
                } else {
                    var caio = new SMC([], new Map(), []);
                    caio.inicializa1(this.C[this.C.length - 1].left, this.C[this.C.length - 1].operator, this.C[this.C.length - 1].right);
                    this.desempilhaControle();
                    caio.resolve();
                    var x = caio.desempilhaValor();
                    this.empilhaValor(x);
                }
            }
        }
    }
};

module.exports = SMC;