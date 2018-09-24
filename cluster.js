const cluster = require('cluster');
const os = require('os');

const cpus = os.cpus();

if (cluster.isMaster) {

    cpus.forEach(() => {
        cluster.fork();
    });

    cluster.on("listening", worker => {
        console.log("cluster %d conectado", worker.process.pid);
    });

    cluster.on("disconnect", worker => {
        console.log("cluster %d desconectado", worker.process.pid);
    });

    cluster.on("exit", worker => {
        console.log("cluster %d perdido", worker.process.pid);
        cluster.fork();
    });

} else {
    require('./index.js');
}

