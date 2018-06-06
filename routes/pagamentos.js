module.exports = function (app) {

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

  app.post('/pagamentos/pagamento', (req, res) => {

    req.assert('forma_de_pagamento', 'forma de pagamento é obrigatório').notEmpty();
    req.assert('valor', 'valor é obrigatório').notEmpty().isFloat();
    req.assert('moeda', 'moeda é obrigatória e deve ter 3 caracteres').notEmpty().len(3, 3);


    let errors = req.validationErrors();

    if (errors) {
      console.log("Erro de validação encontrados");
      res.status(400).send(errors);
      return;
    }

    let pagamento = req.body;

    pagamento.status = 'CRIADO';
    pagamento.data = new Date();

    let connection = new app.persistencia.dbConnection();
    let pagamentoDao = new app.persistencia.PagamentosDao(connection);

    pagamentoDao.salva(pagamento, (err, result) => {
      console.log("requisição sendo feita");

      if (err) {
        res.status(500).send(err);
      }
      else {
        res.location('/pagamentos/pagamento' + result.insertId);
        pagamento.id = result.insertId;

        res.status(201).json(pagamento);
      }
    });

    connection.end();
  });
}