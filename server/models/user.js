const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//when you need to add new methods onto a model, you need to create a schema for it.
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//override what gets sent back after we save as we only want to return the email and the userId
UserSchema.methods.toJSON = function() {
  var user = this;
  //convert our mongoose user to a regular object that is what is one our mongodb object
  var userObject = user.toObject();
  //pick off what we want and return that
  return _.pick(userObject, ['_id', 'email']);
};

//create instance methods - not model methods - not an arrow function, becuase we need to bind 'this'
UserSchema.methods.generateAuthToken = function() {
  var user = this;

  var access = 'auth';
  //create the token using jwt
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  //save the access type and token on this user object
  user.tokens.push({access,token});
  return user.save().then(() =>  {
    //to allow for chaining -- returning the auth token back
    return token;
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
