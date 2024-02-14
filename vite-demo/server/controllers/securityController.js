//define the securityController object to add methods to; the object will be returned at the bottom of the file
const securityController = {};

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

//export the object built out in this file
export default securityController;