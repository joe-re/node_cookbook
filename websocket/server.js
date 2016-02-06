const http = require('http');
const WSServer = require('websocket').server;
const url = require('url');
const clientHtml = require('fs').readFileSync('./websocket/client.html');

const plainHttpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(clientHtml);
}).listen(8080);

const webSocketServer = new WSServer({ httpServer: plainHttpServer });
const accept = [ 'localhost', '127.0.0.1' ];

webSocketServer.on('request', (req) => {
  req.origin = req.origin || '*';
  if (accept.indexOf(url.parse(req.origin).hostname) === -1) {
    req.reject();
    console.log(`${req.origin} isn't allowed to access this.`);
    return;
  }

  const websocket = req.accept(null, req.origin);

  websocket.on('message', (msg) => {
    console.log(`receives "${msg.utf8Data}" from ${req.origin}.`);
    console.log(msg.utf8Data === 'Hello');
    if (msg.utf8Data === 'Hello') {
      websocket.send('Hello, this is websocket server!');
    }
  });

  websocket.on('close', (code, desc) => {
    console.log(`connection close: ${code}-${desc}`);
  });
});
