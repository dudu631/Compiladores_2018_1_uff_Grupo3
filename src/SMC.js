
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

    guardaMemoria(key,x) {
        this.M.set(key, x);
    }

};

module.exports = SMC;


