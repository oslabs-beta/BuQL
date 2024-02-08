const builds = await Bun.build({
  entrypoints: ['./main.jsx'],
  target: 'browser',
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true,
  },
});

const indexFile = Bun.file('index.html');

// import GraphQL handler and schema
import { createHandler } from 'graphql-http/lib/use/fetch';
import { schema } from './server/schema';

// create the graphql over HTTP native fetch handledr
const handler = createHandler({ schema });

const server = Bun.serve({
  port: 8080,
  fetch: async (req, server) => {
    const { pathname } = new URL(req.url);

    if (pathname === '/main.js' && req.method === 'GET') {
      return new Response(builds.outputs[0].stream(), {
        headers: {
          'Content-Type': builds.outputs[0].type,
        },
      });
    }

    // serve on /graphql using the handler
    if (pathname === '/graphql') {
      return handler(req);
    }

    if (pathname === '/' && req.method === 'GET') {
      const indexContent = await indexFile.text();

      const contentWithReactScript = indexContent.replace(
        '<!-- react-script -->',
        `<script type="module" src="/main.js"></script>`
      );

      return new Response(contentWithReactScript, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

// Create a fake GraphQL client to send query and log result
// import { createClient } from 'graphql-http';

// const client = createClient({
//   url: 'http://localhost:8080/graphql',
// });

// (async () => {
//   let cancel = () => {
//     // abort the request if it is in-flight
//   };

//   const result = await new Promise((resolve, reject) => {
//     let result;
//     cancel = client.subscribe(
//       {
//         query: '{ getAllUsers { id username password } }',
//         // mutation: '{ createUser(username: "testuser", password: "12345") { id username password } }',
//       },
//       {
//         next: (data) => (result = data),
//         error: reject,
//         complete: () => resolve(result),
//       }
//     );
//   });
//   console.log('Client Result: ', result);
// })();
