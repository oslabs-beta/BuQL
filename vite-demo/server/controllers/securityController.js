const securityController = {};

//"query { getAllUsers {id username password } hello }"

securityController.checkChars = (req, res, next) => {
  const allowedCharacters = /^[a-zA-Z0-9_{}\s]+$/;
  if (!allowedCharacters.test(req.body.query)){
    return next({
      log:'Invalid character detected in the request body in securityController',
      status: 403,
      message: 'Invalid character, try again.'
    })
  }
  return next();
}

export default securityController;