const http = require('http');
const path = require('path');

const pages = [
  { route: '', output: 'Woohoo!' },
  { route: 'about', output: 'This is simply sample code.' },
  { route: 'another page', output: (route) => `This is ${route}` }
];

http.createServer((request, response) => {
  const lookup = path.basename(decodeURI(request.url));
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
