// typical imports
import express from 'express';
import cors from 'cors';
const app = express();
const port = 8080;

// import graphql and schema
import { graphqlHTTP } from 'express-graphql';
import depthLimit from 'graphql-depth-limit'
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
import buqlController from './controllers/buqlController';

// Route to Buql to check if it's in the cache
// send query string on post request to req.body.query
app.use('/buql', buqlController.checkCache, (req, res) => {
  if (res.locals.cached === true)
    return res.json({ source: 'cache', response: res.locals.response });
  else return res.status(200).redirect('/buqlQuery');
});

// Forward request to this middleware if not in cache
app.use('/buqlQuery', buqlController.addCache, (req, res) => {
  return res.status(202).json({ message: 'successfully buqled' });
});

// Standalone graphql route
app.use('/graphql', graphqlHTTP({ 
  schema, 
  graphiql: true,
  validationRules: [depthLimit(10)]
}));

app.get('/', (req, res) => {
  return res.status(200).json({ BuQL: 'up!' });
});

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
