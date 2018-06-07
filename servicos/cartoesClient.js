const assert = require('restify');
const restify = require('restify-clients');

class ClientCartao {

    constructor(){
        this._client = restify.createJsonClient({
            url: 'http://localhost:3001',
            version: '~1.0'
         });
    };

    autoriza(cartao, callback){
        this._client.post('/cartoes/autoriza', cartao, callback);
    }
}

module.exports = function(){
    return ClientCartao;
}