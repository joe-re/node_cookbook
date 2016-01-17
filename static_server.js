const http = require('http');
const path = require('path');
const fs = require('fs');

const mimeType = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css'
};

const cache = {};
cacheAndDeliver = (f, cb) => {
  fs.stat(f, (_err, stats) => {
    const lastChanged = Date.parse(stats.ctime);
    const isUpdated = (cache[f] && lastChanged > cache[f].timestamp);
    if (!cache[f] || isUpdated) {
      fs.readFile(f, (err, data) => {
        if (!err) {
          cache[f] = { content: data, timestamp: Date.now() };
        }
        cb(err, data);
      });
      return;
    }
    console.log(`load ${f} from cache.`);
    cb(null, cache[f].content);
  });
};

http.createServer((request, response) => {
  const lookup = path.basename(decodeURI(request.url)) || 'index.html';
  const f = 'content/' + lookup;
  fs.exists(f, (exists) => {
    if (exists) {
      cacheAndDeliver(f, (err, data) => {
        if (err) {
          response.writeHead(500);
          response.end('Server Error!');
          return;
        }
        const headers = { 'Content-Type': mimeType[path.extname(f)] };
        response.writeHead(200, headers);
        response.end(data);
      });
      return;
    }
    response.writeHead(404);
    response.end('ページが見つかりません!');
  });
}).listen(8080);

