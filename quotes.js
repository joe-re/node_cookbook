const redis = require('redis');
const client = redis.createClient();
const params = { author: process.argv[2], quotes: process.argv[3] };

client.on('ready', () => {
  const indexString = `Author: ${params.author}`;
  if (params.author && params.quotes) {
    const randKey = `Quotes: ${(Math.random() * Math.random()).toString(16).replace('.', '')}`;
    client.hmset(randKey, {
      author: params.author,
      quotes: params.quotes
    });
    client.sadd(indexString, randKey);
  }
  if (params.author) {
    client.smembers(indexString, (_err, keys) => {
      keys.forEach((key) => {
        client.hgetall(key, (__err, hash) => {
          if (hash) {
            console.log('%s: %s', hash.author, hash.quotes);
          } else {
            console.log('unknown key...');
          }
        });
      });
      client.quit();
    });
  } else {
    client.quit();
  }
});
