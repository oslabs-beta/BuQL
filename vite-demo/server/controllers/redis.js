// import ioredis
import { Redis } from 'ioredis';

// initialize, with config if necessary
const redis = new Redis();

// set the default config for redis caching
await redis.config('set', 'maxmemory', '100mb');
await redis.config('set', 'maxmemory-policy', 'allkeys-lfu');
const result1 = await redis.config('get', 'maxmemory');
const result2 = await redis.config('get', 'maxmemory-policy');
// console.log('max memory: ', result1);
// console.log('eviction policy: ', result2);

export default redis;
