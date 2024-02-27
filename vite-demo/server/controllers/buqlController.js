// import ioredis
import redis from './redis';

const buqlController = {};

buqlController.checkCache = async (req, res, next) => {
  try {
    // destructure from req.body
    const { query } = req.body;

    // check if operation type is a mutation
    if (query.includes('mutation')) {
      // send query to graphql route
      console.log('mutating the database');
      const data = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      // add a check to see if query is valid

      // clear the redis cache
      await redis.flushall();
      console.log('cache cleared');

      // parse and return the response
      const parsed = await data.json();
      return res.json({ source: 'mutation', response: parsed });
    }

    // check if query exists in redis cache; result is stringified by default
    const result = await redis.get(query);

    if (result) {
      // if query exists, return response
      console.log('returning from the cache');
      const objResult = await JSON.parse(result);
      return res.json({ source: 'cache', response: objResult });
    } else {
      // else, move to next middleware
      return next();
    }
  } catch (err) {
    // add a detailed error log
    console.log('Error in BuQLController', err);
    return next(err);
  }
};

buqlController.addCache = async (req, res) => {
  // send query, add stringified response to cache, and return json response
  const { query } = req.body;

  // send query to graphql route
  console.log('querying the database');
  const data = await fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query }),
  });

  // add a check to see if query is valid

  // convert the response to a string for storage
  const parsed = await data.json();
  const string = await JSON.stringify(parsed);

  // save to redis cache
  await redis.set(query, string);
  console.log('saved to cache');

  // return response
  return res.json({ source: 'database', response: parsed });
};

buqlController.clearCache = async (req, res, next) => {
  // clear the cache
  await redis.flushall();
  console.log('cache cleared');
  return next();
};

export default buqlController;
