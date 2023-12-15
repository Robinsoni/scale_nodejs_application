// cluster.js
const cluster = require('cluster');
const os = require('os');

// **** Mock DB Call
const numberOfUsersInDB = function () {
    this.count = this.count || 5;
    this.count = this.count * this.count;
    return this.count;
}
// ****

if (cluster.isMaster) {
    const cpus = os.cpus().length;

    console.log(`Forking for ${cpus} CPUs`);
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
    // Right after the fork loop within the isMaster=true block
    const updateWorkers = () => {
        const usersCount = numberOfUsersInDB();
        Object.values(cluster.workers).forEach(worker => {
            worker.send({ usersCount });
        });
    };

    updateWorkers();
    setInterval(updateWorkers, 10000);
    // Right after the fork loop within the isMaster=true block
cluster.on('exit', (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) { // for making sure that the master process is not closing this because of the overload of process and then only fork the process herer.
      console.log(`Worker ${worker.id} crashed. ` +
                  'Starting a new worker...');
      cluster.fork();
    }
  });
    ///
    /* Object.values(cluster.workers).forEach(worker => {
        worker.send(`Hello Worker ${worker.id}`);
    }); */
} else {
    require('./server');
}