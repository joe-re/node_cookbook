const redis = require('redis');
const client = redis.createClient();

if (process.argv.slice(2).forEach((authorChannel, i) => {
  client.subscribe(authorChannel, () => {
    console.log(`subescribe ${authorChannel}`);
  });
}));
client.on('message', (channel, msg) => {
  console.log('%s: %s', channel, msg);
});
