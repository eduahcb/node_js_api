module.exports = function(app){
    
    app.get('/pagamentos/pagamento', (req, res) =>{
        res.send("OK"); 
    });
    
}