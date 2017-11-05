const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

//jwt.sign - hashing it for us
//jwt.verify - verifies it is our hash

var data = {
  id: 10
};

var token = jwt.sign(data, '123abc'); //2nd parameter is our salt
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);
