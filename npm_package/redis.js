// import ioredis
import { Redis } from 'ioredis';

// initialize, with config if necessary
const redis = new Redis();

// set the default config for redis caching
redis.config('set', 'maxmemory', '100mb');
redis.config('set', 'maxmemory-policy', 'allkeys-lfu');

export default redis;
