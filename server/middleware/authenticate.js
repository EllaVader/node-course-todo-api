var {User} = require('./../models/user');

//make this middleware so we authenticate prior to each call that we want to levarage authentication
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user){
      //this will be caught in the catch below and return a 401
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send(); //auth
  });
};

module.exports = {authenticate};
