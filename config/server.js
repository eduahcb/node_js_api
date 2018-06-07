const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const validator = require('express-validator');

module.exports = function () {

    let app = express();

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
