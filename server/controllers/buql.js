import redis from './redis';
import {handleQuery} from './helpers';

const buql = {};

buql.cache = async (req, res, next) => {
  const {query} = req.body;

  // check if query is a mutation
  if (query.includes('mutation')) {
    // send query to graphql route
    const data = await fetch(`http://localhost:${Bun.env.PORT}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: query}),
    });

    // clear the redis cache
    await redis.flushdb();

    // parse and return the response
    const parsed = await data.json();
    const mutationResponse = {source: 'mutation', response: parsed};
    res.locals.response = mutationResponse;

    return next();
  }

  // if query, proceed as normal
  const queryRes = await handleQuery(query);
  if (!queryRes.response.errors) {
    console.log('Query response: ', queryRes.response);
    console.log('Cache hits: ', queryRes.cacheHits);
    console.log('Not in cache: ', queryRes.nonCache);
  }
  res.locals.response = queryRes;
  return next();
};

buql.clearCache = async (req, res, next) => {
  // clear the cache
  await redis.flushdb();
  return next();
};

export default buql;
