module.exports = function(app){
    
    app.get('/pagamentos', (req, res) =>{
        res.send("OK"); 
    });
    
    app.post('/pagamentos/pagamento', (req, res) =>{
        
        let pagamento = req.body;
                 
        pagamento.status = 'CRIADO';
        pagamento.data = new Date();
        
        let connection = new app.persistencia.dbConnection();
        let pagamentoDao = new app.persistencia.PagamentosDao(connection);
        
        pagamentoDao.salva(pagamento, (err, result) =>{
            console.log("requisição sendo feita");
            
            if(err){
                res.status(500).send(err);
            }
            else{    
                res.status(201).json(pagamento);
            }
        });
        
        connection.end();
    });
}