var express = require('express');
//gets JSON and convert it into an object
var bodyParser = require('body-parser');

//using ES6 destructuring
var {moongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

//1. our server
var app = express();

// set up middleware - app.use does processing when request is received.
//this will store request in req.body
app.use(bodyParser.json());

//GET - requests data from a resource
//POST - submits data to be processed to a resource

//2. configure routes
//POST
app.post('/todos', (req, res) => {
  //create a new todo object from our request
   var todo = new Todo({
     text: req.body.text
   });

  //save the model to the  db
  todo.save().then((doc) => {
    //send the saved todo back
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

//GET all todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {  //returns a Promise, success callback and error callback
    //the find returns an array of results, we want to convert it an object
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  });
});

//3. start server
app.listen(3000, () => {
  console.log('Started on port 3000');
});

//so our test file can use it.
module.exports = {app};
