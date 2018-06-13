var BigNumber = require('bignumber.js');

class SMC {
    constructor(E, S, M, C) {
        this.E = E;
        this.S = S;
        this.M = M;
        this.C = C;
        this.address = 0;
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


    isNumber(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }

    resolvePrint() {

    }

    json() {

        var temp = this.strMapToObj(this.M);
        var ambiente = this.E != null ? this.strMapToObj(this.E) : null;
        var smc = new SMC(ambiente, this.S, temp, this.C);
        smc.setAddress(this.address);
        return JSON.stringify(smc);
    }

    //Funcao auxiliar para printar o map 
    strMapToObj(strMap) {
        let obj = Object.create(null);
        for (let [k, v] of strMap) {
            // We don’t escape the key '__proto__'
            // which can cause problems on older engines
            obj[k] = v;
        }
        return obj;
    }
};

module.exports = SMC;