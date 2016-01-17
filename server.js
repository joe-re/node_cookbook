const http = require('http');
http.createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end('woohoo!');
}).listen(8080);
