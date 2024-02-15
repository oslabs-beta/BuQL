// typical imports
import express from 'express';
import cors from 'cors';
const app = express();
const port = 8080;

// import graphql and schema
import {graphqlHTTP} from 'express-graphql';
import {schema} from './schema/schema';

//imports for validationRules (security)
import depthLimit from 'graphql-depth-limit';
import {createComplexityLimitRule} from 'graphql-validation-complexity';

/* this will be an optional method on the BuQL object as a whole;
user will pull it from the created BuQL object (const security = BuQL.security) 
then, when passing it in as middleware, invoke it with custom options if they need ('/endpoint', security(custom options), (req, res) => ... )*/
function RulesCreator(givenLimit = 10, costLimit = 1000, customRules) {
  //define the default list of rules; source: https://github.com/4Catalyzer/graphql-validation-complexity
  const defaultRules = {
    scalarCost: 1,
    objectCost: 0,
    listFactor: 10,
    introspectionListFactor: 2,
  };
  //check if user has passed in custom options
  if (customRules) {
    //verify that custom options is an object (but not an array)
    if (typeof customRules !== 'object' || Array.isArray(customRules)) {
      throw new Error('customRules should be an object');
    }
    //combine defaultRules with the custom rules
    Object.assign(defaultRules, customRules);
  }
  //return the costlimit and default rules
  return [depthLimit(givenLimit), costLimit, defaultRules];
}
/* there's two ways this can go:
      1. set this up as a ternary, checking if the user has called it or something (what i have right now)
      2. make sure the user pulls and invokes it, whether or not they use the options */

const rules =
  /* something ? */ RulesCreator(); /* : RulesCreator(things, user, passes, in) */

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
  return res.status(202).json({message: 'successfully buqled'});
});

// Clear cache route
app.use('/clearCache', buqlController.clearCache, (req, res) => {
  return res.status(205).send('cache cleared!');
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

app.get('/', (req, res) => {
  return res.status(200).json({BuQL: 'up!'});
});

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
