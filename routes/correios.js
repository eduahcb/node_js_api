module.exports = function(app){

    app.post('/correios/calcula-prazo', (req, res) =>{

        let dados_entrega = req.body;

        let correios = new app.servicos.correiosSOAPClient();

        correios.calculaPrazo(dados_entrega, (err, result) =>{

            if(err){
                console.log(`Ocorreu um erro: ${err}`);
                res.status(500).send(err);
                return;
            }
            else{
                console.log("prazo calculado");
                res.json(result);
            }
        });

    });
}