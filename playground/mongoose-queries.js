const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//var id = '69f9e2ff15aafe37160c7684'; //id that doesn't exist in the db
var id = '59f9e2ff15aafe37160c768411'; //invalid id (not the correct format)
//var id = '59f9e2ff15aafe37160c7684';

//you can use this to validate an id rather than having it throw an exception
if(!ObjectID.isValid(id)){
  console.log('ID not valid');
}

//Note - for all of these calls, if it doesn't find any results, it will return either
//and empty array for find, or null for findOne and findById
//if the ID is invalid (not correct format it will throw an exception)
<MongoseObject>.find() with mongoose - return all or query by some criteria
mongoose will convert our string id into the mongo object id
Todo.find({
  _id: id
}).then((todos) => { //then callback contains the result of our query in the form of an array of Todo objects
  console.log('Todos', todos);
});

//<MongoseObject>.findOne() with mongoose - return only the first one it finds
Todo.findOne({
  _id: id
}).then((todo) => { //then callback contains the result of our query in the form of one Todo object
  console.log('Todo', todo);
});

//<MongoseObject>.findById() with mongoose - finds by Id passed in as string or id object
Todo.findById(id).then((todo) => { //then callback contains the result of our query in the form of one Todo object
  if(!todo){ //if no results found returns null
    return console.log('Id not found')
  }
  console.log('Todo by id', todo);
}).catch((e) => console.log(e)); //if there was a problem with the call, it will throw an exception, so handle it.

//Challenge - User.findById -- do all 3 cases, found, not found and any errors
const userId = '59f6380be3bfdf10f6675783';
either this way (catch the exception) or the way below (with the error promise)
User.findById(userId).then((user) => {
  if(!user){
    return console.log(`User not found with id ${userId}`);
  }
  console.log(user);
}).catch((e) => console.log(e));

User.findById(userId).then((user) => {
  if(!user){
    return console.log(`User not found with id ${userId}`);
  }
  console.log(user);
}, (err) => {
  console.log(err);
})
