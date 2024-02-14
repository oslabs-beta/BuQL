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
import securityController from './controllers/securityController';

// Route to Buql to check if it's in the cache
app.use(
  '/buql',
  buqlController.checkCache,
  buqlController.addCache,
  (req, res) => {
    return res.status(206).send('hello');
  }
);

// Forward request to this middleware if not in cache
app.use('/buqlQuery', buqlController.addCache, (req, res) => {
  return res.status(202).json({ message: 'successfully buqled' });
});

// Clear cache route
app.use('/clearCache', buqlController.clearCache, (req, res) => {
  return res.status(205).send('cache cleared!');
});

// Standalone graphql route
app.use('/graphql', securityController.checkChars, graphqlHTTP({ 
  schema, 
  graphiql: true,
  //look into what other validation rules there are
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
