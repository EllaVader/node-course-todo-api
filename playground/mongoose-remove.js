const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//mongoose has 3 methods to delete records
//1. Todo.remove({}) - to remove all pass in empty object
//2. Todo.findOneAndRemove - removes the first document that matches the query. - Returns the removed document
//3. Todo.findByIdAndRemove - Returns the removed doc

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({text: 'Delete Me'}).then((todo) => {
//   console.log(todo);
// });

Todo.findByIdAndRemove('59fa51189a7bcb74c3468b92').then((todo) => {
  console.log(todo);
});
