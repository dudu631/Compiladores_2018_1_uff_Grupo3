
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

    resolvePrint() {

    }

    //Resolve a operação
    resolveExpressoes(fun) {
        var aux = this.desempilhaControle();

        if (aux != "neg") {
            var second = this.desempilhaValor();
            var first = this.desempilhaValor();

            if (!this.isNumber(second) && this.M.has(second)) {
                second = this.acessaMemoria(second);
            }
            if (!this.isNumber(first) && this.M.has(first)) {
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

        }
    }

    isNumber(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }
   
    json(){

        var temp=this.strMapToObj(this.M);

        return JSON.stringify(new SMC(this.S, temp, this.C));
    }

    //Funcao auxiliar para printar o map 
    strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k,v] of strMap) {
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        }
        return obj;
    }
};


