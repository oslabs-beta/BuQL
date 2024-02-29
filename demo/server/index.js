// typical imports
import express from 'express';
const app = express();
const port = Bun.env.PORT;

// import graphql and schema
import {graphqlHTTP} from 'express-graphql';
import {schema} from './schema/schema';

app.use(express.json());

// import buql
import buql from '@buql/buql';

app.use('/buql', buql.security, buql.cache, (req, res) => {
  return res.status(200).send(res.locals.response);
});

app.use('/clearCache', buql.clearCache, (req, res) => {
  return res.status(200).send('cache cleared');
});

// Standalone graphql route
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use('*', (req, res) => res.status(404).send('Page not found'));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught an unknown middlware error',
    status: 500,
    message: {err: 'An error occurred'},
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj);
  return res.status(errorObj.status).send(errorObj.message);
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
