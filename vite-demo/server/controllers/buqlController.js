// import ioredis
import redis from './redis';
// import { schema } from '../schema/schema';
// import { graphql } from 'graphql';

const buqlController = {};

// send mock graphql response
// const source = 'query { getAllUsers { id username password } hello }';
// const response = await graphql({ schema, source });

buqlController.checkCache = async (req, res, next) => {
  try {
    // if query is in cache, set res.locals.cached === true and res.locals.response === response
    // if query isn't in cache, set res.locals.cached === false
    
    // destructure from req.body
    const { query } = req.body;
    console.log(query);

    // check if query exists in redis cache
    const result = await redis.get(query);
    if (result) {
      const objResult = await JSON.parse(result);
      res.locals.response = objResult;
      res.locals.cached = true;
      return next();
    } else {
      res.locals.cached = false;
      return next();
    }
  } catch (error) {
    console.log('Error in BuQLController', error);
  }
};

buqlController.addCache = async (req, res, next) => {
  //
  console.log('in buqlController');
  return next();
};

export default buqlController;
