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
