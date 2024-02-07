import { createClient } from 'redis';

const redisClient = createClient();
await redisClient.connect();

// await redisClient.set('key', 'hello');
// await redisClient.set('key','value', "EX", redisClient.ttl(key))
await redisClient
  .set('key', 'value', { EX: 60 * 60 })
  .then(() => console.log('set exp'));
const value = await redisClient.get('key');
const ttl = await redisClient.ttl('key');

console.log(value); // "Hello!"
console.log('ttl', ttl); // ttl number

// sets the interval at which its logs how much Time To Live (TTL) the key has
const id = setInterval(async () => {
  const newTime = await redisClient.ttl('key');
  console.log(newTime);
}, 1000);

// sets how long the interval logs the TTL for
setTimeout(() => {
  clearInterval(id);
}, 50000);

// SET EXPIRE on the key

export default redisClient;
