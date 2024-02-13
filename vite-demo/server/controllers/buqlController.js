// import ioredis
import redis from './redis';
import { schema } from '../schema/schema';
import { graphql } from 'graphql';

const buqlController = async (req, res, next) => {
  try {
    // main application logic
    // check if it's in the cache
    // if it isn't, redirect to /graphql route
    // if it is, respond with cached data

    // send mock graphql response
    const source = 'query { getAllUsers { id username password } hello }';
    const response = await graphql({ schema, source });

    // convert

    // convert query response to a string for storage
    const strRes = await JSON.stringify(response);

    // set redis key = query string, value = query reponse string
    await redis.set(
      'query { getAllUsers { id username password } hello }',
      strRes
    );

    // retrieve stored query from redis, receiving a string
    const result = await redis.get(
      'query { getAllUsers { id username password } hello }'
    );

    // convert string back to JSON to send to client
    const jsonResult = JSON.parse(result);

    return next();
  } catch (error) {
    console.log('Error in BuQLController', error);
  }
};

export default buqlController;
