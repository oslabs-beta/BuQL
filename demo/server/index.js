// typical imports
import express from 'express';
import cors from 'cors';
const app = express();
const port = 8080;

// import graphql and schema
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schema/schema';

// configure cors, json parsing, url encoding
const corsOptions = {
  origin: '*',
  credentials: true,
  optionalSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// import controllers
import buql from './controllers/buql';
import securityController from './controllers/securityController';

// Route to Buql to check if it's in the cache
app.use('/buql', buql.cache, (req, res) => {
  return res.status(200).send(res.locals.response);
});

// Clear cache route
app.use('/clearCache', buql.clearCache, (req, res) => {
  return res.status(200).send('cache cleared');
});

// Standalone graphql route
app.use(
  '/graphql',
  securityController.checkChars,
  graphqlHTTP({
    schema,
    graphiql: true,
    //validation rules for security
    //validationRules: [...rules]
  })
);

app.use('*', (req, res) => res.status(404).send('Page not found'));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught an unknown middlware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj);
  return res.status(errorObj.status).send(errorObj.message);
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
