const {SHA256} = require('crypto-js');
//hashing is 1-way algorithm.  Can never un-hash the hashed value to get the original value
var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

//simulate a user Id and then hash it.
var data = {
  id: 4
};

//this simulates what we will send back to the user - it's their user id,
//and the hashed value of their user object (the data object above)

//SALT the hash - add something onto the hash that is unique that changes the value
//so add 'somesecret' to it, (for example)
const salt = 'somesecret';

var token = {
  data,
  hash: SHA256(JSON.stringify(data) + salt).toString()
}

//simulate someone tried to tamper, but they don't know the salt so it will not work for them
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data).toString());


var resultHash = SHA256(JSON.stringify(token.data) + salt).toString();
if(resultHash === token.hash){
  console.log('Data was not changed');
} else {
  console.log("Data was changed.  Don't trust");
}

//there is a library out there that does all this for us called JWT (JSON Web Token)
//refer to hashing2.js for how that works
