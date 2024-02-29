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
  res.locals.response = queryRes;
  return next();
};

buql.clearCache = async (req, res, next) => {
  // clear the cache
  await redis.flushdb();
  return next();
};

buql.security = (req, res, next) => {
  //declare an allow list (more secure than a block list)
  const allowedCharacters = /^[a-zA-Z0-9_{}(),":$\s]+$/; //this allows all letters, white spaces, numbers, curly braces, parantheses, underscores, colons, commas, and dollar signs
  //if any character in the query is not defined in the allow list, return an error
  if (!allowedCharacters.test(req.body.query)){
    return next({
      log:'Invalid character detected in the request body in securityController',
      status: 403,
      message: 'Invalid character, try again.'
    })
  }
  //otherwise, move on to the next middleware
  return next();
}

export default buql;
