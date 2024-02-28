import redis from './redis';
import { handleQuery } from './helpers';

const buql = {};

// TO-DO
// Fix query type not populating on response object from database
// Clean up comments / variable names in helpers.js
// Generalize all fetch requests to format strings using Bun.env

buql.cache = async (req, res, next) => {
  const { query } = req.body;

  // check if query is a mutation
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

    // clear the redis cache
    await redis.flushdb();
    console.log('cache cleared');

    // parse and return the response
    const parsed = await data.json();
    const mutationResponse = { source: 'mutation', response: parsed };
    res.locals.response = mutationResponse;

    return next();
  }

  // if query, proceed as normal
  const { queryRes, cacheHits, nonCache } = await handleQuery(query);
  console.log('Query response: ', queryRes);
  console.log('Cache hits: ', cacheHits);
  console.log('Not in cache: ', nonCache);

  res.locals.response = queryRes;

  return next();
};

buql.clearCache = async (req, res, next) => {
  // clear the cache
  await redis.flushdb();
  console.log('cache cleared');
  return next();
};

export default buql;
