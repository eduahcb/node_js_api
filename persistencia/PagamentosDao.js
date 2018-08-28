class PagamentosDao {
    
    constructor(connection){
        this._connection = connection;
    }
    
    lista(callback){
        this._connection.query('select * from pagamentos', callback);
    }
    
    buscaPorId(id, callback){
        this._connection.query("select * from pagamentos where id  = ?", id, callback);
    }
    
    salva(pagamento, callback){
        this._connection.query('insert into pagamentos set ?', pagamento, callback);
    }
    
    atualiza(pagamento, callback){
        this._connection.query('update pagamentos set status = ? where id = ?', [pagamento.status, pagamento.id], callback);
    }
}

module.exports = function(){
    return PagamentosDao;
}