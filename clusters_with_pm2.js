const http = require('http');
const options = [
    "yes", 
    "no"
];
let count = 0;
const server = http.createServer((req, res) => {
    const randomIndex = Math.floor(Math.random() * options.length);
    const advice = options[randomIndex];
    const payload = JSON.stringify({
        processID: process.pid,
        advice,
        count:++count
    });
    console.log(`advice from ${process.pid}: ${advice}::`);
    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(payload);
});

server.listen(3000);
console.log(`advice service running`);