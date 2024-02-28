//define the securityController object to add methods to; the object will be returned at the bottom of the file
const securityController = {};
//imports for validationRules (security)
import {createComplexityLimitRule} from 'graphql-validation-complexity';
import depthLimit from 'graphql-depth-limit';

//example query: "query { getAllUsers {id username password } hello }"

//define a checkChars method to ensure the characters used dont resemble injection attacks (i.e. 1=1, <element>, etc.)
securityController.checkChars = (req, res, next) => {
  //declare an allow list (more secure than a block list)
  const allowedCharacters = /^[a-zA-Z0-9_{}(),":$\s]+$/; //this allows all letters, white spaces, numbers, curly braces, parantheses, underscores, colons, commas, and dollar signs
  //if any character in the query is not defined in the allow list, return an error
  if (!allowedCharacters.test(req.body.query)){
    return next({
      log:'Invalid character detected in the request body in securityController',
      status: 403,
      message: 'Invalid character, try again.'
    })
  }
  //otherwise, move on to the next middleware
  return next();
}

/*   an example timeout function

request.incrementResolverCount =  function () {
    var runTime = Date.now() - startTime;
    if (runTime > 10000) {  // a timeout of 10 seconds
      if (request.logTimeoutError) {
        logger('ERROR', `Request ${request.uuid} query execution timeout`);
      }
      request.logTimeoutError = false;
      throw 'Query execution has timeout. Field resolution aborted';
    }
    this.resolverCount++;
  };
  
*/

/* this will be an optional method on the BuQL object as a whole;
user will pull it from the created BuQL object (const security = BuQL.security) 
then, when passing it in as middleware, invoke it with custom options if they need ('/endpoint', security(custom options), (req, res) => ... )*/
securityController.RulesCreator = (givenLimit = 10, costLimit = 1000, customRules) => {
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
  //console.log(givenLimit, costLimit, defaultRules)
  //return the costlimit and default rules
  return [depthLimit(givenLimit), costLimit, defaultRules];
}
/* there's two ways this can go:
      1. set this up as a ternary, checking if the user has called it or something (what i have right now)
      2. make sure the user pulls and invokes it, whether or not they use the options */

//console.log(RulesCreator())
//export the object built out in this file
export default securityController;