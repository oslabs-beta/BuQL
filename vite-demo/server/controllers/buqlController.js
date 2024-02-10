// import ioredis
import redis from './redis';
import { schema } from '../schema/schema';
import { graphql } from 'graphql';

const buqlController = async (req, res, next) => {
  // main application logic
  // check if it's in the cache
  // if it isn't, redirect to /graphql route
  // if it is, respond with cached data

  //
  const source = 'query { getAllUsers { id username password } hello }';
  graphql({ schema, source }).then((data) => {
    console.log('data: ', data);
  });

  // figure out storage for the query string and its data

  // TODO -> figure out mutations

  // const source1 = 'mutation { createUser(username: "testuser", password: "12345") { UserType { id username password } } }';

  // graphql({ schema, source1 }).then((result) => {
  //   console.log('result: ', result);
  // });

  await redis.set('key', 'value');
  const result = await redis.get('key');

  console.log('result: ', result);

  return next();
};

export default buqlController;
