const http = require('http');

const pages = [
  { route: '/', output: 'Woohoo!' },
  { route: '/about/this', output: 'Multi struct routing by node' },
  { route: '/about/node', output: 'Event I/O for V8 engine' },
  { route: '/another page', output: (route) => `This is ${route}` }
];

http.createServer((request, response) => {
  const lookup = decodeURI(request.url);
  pages.forEach((page) => {
    if (page.route === lookup) {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(typeof page.output === 'function' ? page.output(page.route) : page.output);
    }
  });
  if (!response.finished) {
    response.writeHead(404);
    response.end('ページが見つかりません!');
  }
}).listen(8080);
