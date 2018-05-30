const app = require('./config/server')();


app.listen(8080, () =>{
    console.log("servidor rodando na porta 8080");
});