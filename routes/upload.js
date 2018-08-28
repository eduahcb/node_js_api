const fs = require('fs');

module.exports = (app) => {

    app.post('/upload/imagem', (req, res) => {

        console.log('recebendo imagem');

        const file = req.headers.filename;

        req.pipe(fs.createWriteStream(`./files/${file}`))
            .on('finish', () => {
                console.log('arquivo escrito');
                res.status(201).json({"msg" : "ok"});
            });
    });
}