// REDIS
import redisClient from './redis';

// SET UP SERVER

// Jake -> convert back to express

import { createHandler } from 'graphql-http/lib/use/fetch'; // bun install graphql-http
const { schema } = require('./schema');

// Create the GraphQL over HTTP native fetch handler
const handler = createHandler({ schema });

// Start serving on `/graphql` using the handler
export default {
  port: 4000, // Listening to port 4000
  fetch(req) {
    const [path, _search] = req.url.split('?');
    if (path.endsWith('/graphql')) {
      // console.log('req', req);
      // console.log('req.body', req.body)
      return handler(req);
    } else {
      return new Response(null, { status: 404 });
    }
  },
};

// CREATE CLIENT

// Jake -> convert to normal .then chaining

import { createClient } from 'graphql-http';

const client = createClient({
  url: 'http://localhost:4000/graphql',
});

(async () => {
  let cancel = () => {
    /* abort the request if it is in-flight */
  };

  const result = await new Promise((resolve, reject) => {
    let result;
    cancel = client.subscribe(
      {
        query: '{ hello }',
      },
      {
        next: (data) => (result = data),
        error: reject,
        complete: () => resolve(result),
      }
    );
  });

  // do something with the result
  console.log('result: ', result);
  console.log('result.data: ', result.data);
})();

// try to console log the body somewhere server-side
// on /graphql route, try to add to Redis cache
// then figure out unique ids
