const numCPUs = require('os').cpus().length;
const  cluster = require('cluster');
const http = require('http');
var count = 0; 
if(cluster.isMaster){
    console.log("this is the master process:",process.pid);
    for(let i=0;i<numCPUs;i++){
        cluster.fork();
    } 
}else{
   
    console.log("this is the worker process:",process.pid);
    http.createServer((req,res) => {
        ++count
        const message = `Worker: ${process.pid},count: ${count}`;
        console.log(message);
        res.end(message)
    }).listen(3000);
}

