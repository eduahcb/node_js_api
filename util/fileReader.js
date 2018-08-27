const fs = require('fs');
const arquivo = process.argv[2];


fs.readFile(arquivo, (err, buffer) =>{

    fs.writeFile(`${arquivo}.jpg`, buffer, (err) => {
        console.log('arquivo comprimido');
    })
});