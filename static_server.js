const http = require('http');
const path = require('path');
const fs = require('fs');

const mimeType = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css'
};

const cache = {};

http.createServer((request, response) => {
  const lookup = path.basename(decodeURI(request.url)) || 'index.html';
  const f = 'content/' + lookup;
  fs.exists(f, (exists) => {
    if (exists) {
      const headers = { 'Content-Type': mimeType[path.extname(f)] };
      if (cache[f]) {
        response.writeHead(200, headers);
        response.end(cache[f].content);
        return;
      }
      const s = fs.createReadStream(f).once('open', () => {
        fs.stat(f, (_err, stats) => {
          const bufferOffset = 0;
          cache[f] = { content: new Buffer(stats.size) };
          s.on('data', (data) => {
            data.copy(cache[f].content, bufferOffset);
            bufferOffset = data.length;
          });
        });
        response.writeHead(200, headers);
        s.pipe(response);
      }).once('error', (e) => {
        console.log(e);
        console.log('Server Error!');
      });
      return;
    }
    response.writeHead(404);
    response.end('ページが見つかりません!');
  });
}).listen(8080);

