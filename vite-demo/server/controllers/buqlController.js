// import ioredis
import redis from './redis';
// import { schema } from '../schema/schema';
// import { graphql } from 'graphql';

const buqlController = {};

// send mock graphql response
// const source = 'query { getAllUsers { id username password } hello }';
// const source2 = JSON.parse(source);
// const response = await graphql({ schema, source });

buqlController.checkCache = async (req, res, next) => {
  try {
    // destructure from req.body
    const { query } = req.body;

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
    console.log('Error in BuQLController', err);
    return next(err);
  }
};

buqlController.addCache = async (req, res, next) => {
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
