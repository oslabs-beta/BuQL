const security = {};

//define a checkChars method to ensure the characters used dont resemble injection attacks (i.e. 1=1, <element>, etc.)
security.checkChars = (req, res, next) => {
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

export default security;