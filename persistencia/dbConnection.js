const mysql = require('mysql');

function createDbConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'payfast',
        insecureAuth : true
    });
}
module.exports = function () {
    return createDbConnection;
}