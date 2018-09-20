const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const morgan = require('morgan');
const logger = require('../servicos/logger');

module.exports = function () {

    let app = express();

    app.use(morgan('common', {
        stream : {
            write : (mensagem) => {
                logger.info(mensagem);
            }
        }
    }))
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(validator());

    consign()
        .include('routes')
        .then('persistencia')
        .then('servicos')
        .into(app);

    return app;
}
