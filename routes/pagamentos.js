module.exports = function (app) {

    const pagamento_criado = "CRIADO";
    const pagamento_confirmado = "CONFIRMADO";
    const pagamento_cancelado = "CANCELADO";

    app.get('/pagamentos', (req, res) => {

        let connection = new app.persistencia.dbConnection();
        let pagamentoDao = new app.persistencia.PagamentosDao(connection);

        pagamentoDao.lista((err, result) => {
            if (err) {
                console.log(`Ocorreu um errro: ${err}`);
                res.send(err);
            }
            else {
                res.send(result);
            }
        });
    });

    app.get('/pagamentos/pagamento/:id', (req, res) => {

        const id = req.params.id;

        let connection = new app.persistencia.dbConnection();
        let pagamentoDao = new app.persistencia.PagamentosDao(connection);
        
        pagamentoDao.buscaPorId(id, (err, result) => {
            if(err){
                res.status(500).json(err);
            }
            else{
                res.status(200).json(result);
            }
        })

    });

    app.post('/pagamentos/pagamento', (req, res) => {

        req.assert('pagamento.forma_de_pagamento', 'forma de pagamento é obrigatório').notEmpty();
        req.assert('pagamento.valor', 'valor é obrigatório').notEmpty().isFloat();
        req.assert('pagamento.moeda', 'moeda é obrigatória e deve ter 3 caracteres').notEmpty().len(3, 3);


        let errors = req.validationErrors();

        if (errors) {
            console.log("Erro de validação encontrados");
            res.status(400).send(errors);
            return;
        }

        let pagamento = req.body["pagamento"];

        pagamento.status = pagamento_criado;
        pagamento.data = new Date();

        let connection = new app.persistencia.dbConnection();
        let pagamentoDao = new app.persistencia.PagamentosDao(connection);

        pagamentoDao.salva(pagamento, (err, result) => {
            console.log("requisição sendo feita");

            if (err) {
                res.status(500).send(err);
                return;
            }
            else {

                if (pagamento.forma_de_pagamento == "cartao") {

                    let cartao = req.body["cartao"];
                    console.log(cartao);

                    let cartoesClient = new app.servicos.cartoesClient();

                    cartoesClient.autoriza(cartao, (exception, request, response, retorno) => {

                        if (exception) {
                            console.log(`Ocorreu um erro: ${exception}`);
                            res.status(400).send(exception);
                            return;
                        }
                        console.log(retorno);

                        res.location('/pagamentos/pagamento' + pagamento.id);

                        let responses = {
                            dados_do_pagamento: pagamento,
                            cartao : cartao,
                            links: [
                                {
                                    href: `http//localhost:8080/pagamentos/pagamento/${pagamento.id}`,
                                    rel: "confirmar",
                                    method: "PUT"
                                },
                                {
                                    href: `http//localhost:8080/pagamentos/pagamento/${pagamento.id}`,
                                    rel: "cancelar",
                                    method: "DELETE"
                                }
                            ]
                        }
                        res.status(201).json(responses);
                        return;
                    });
                }
                else {

                    pagamento.id = result.insertId;
                    res.location('/pagamentos/pagamento' + pagamento.id);

                    let response = {
                        dados_do_pagamento: pagamento,
                        links: [
                            {
                                href: `http//localhost:8080/pagamentos/pagamento/${pagamento.id}`,
                                rel: "confirmar",
                                method: "PUT"
                            },
                            {
                                href: `http//localhost:8080/pagamentos/pagamento/${pagamento.id}`,
                                rel: "cancelar",
                                method: "DELETE"
                            }
                        ]
                    }
                    res.status(201).json(response);
                }
            }
        });
        connection.end();
    });

    app.put('/pagamentos/pagamento/:id', (req, res) => {

        let pagamento = {};
        let id = req.params.id;

        pagamento.id = id;
        pagamento.status = pagamento_confirmado;

        let connection = new app.persistencia.dbConnection();
        let pagamentoDao = new app.persistencia.PagamentosDao(connection);

        pagamentoDao.atualiza(pagamento, (err, result) => {
            if (err) {
                console.log(`Ocorreu um erro: ${err}`);
                res.status(500).send(err);
            }
            else {
                console.log("pagamento criado");
                res.send(pagamento);
            }
        });
        connection.end();
    });

    app.delete('/pagamentos/pagamento/:id', (req, res) => {

        let pagamento = {};
        let id = req.params.id;

        pagamento.id = id;
        pagamento.status = pagamento_cancelado;

        let connection = new app.persistencia.dbConnection();
        let pagamentoDao = new app.persistencia.PagamentosDao(connection);

        pagamentoDao.atualiza(pagamento, (err, result) => {
            if (err) {
                console.log(`Ocorreu um erro: ${err}`);
                res.status(500).send(err);
            }
            else {
                res.status(204).json(pagamento);
            }
        });
        connection.end();
    });
}