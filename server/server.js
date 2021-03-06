require('./config/config');
const _ = require('lodash');
const express = require('express');
//gets JSON and convert it into an object
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//using ES6 destructuring
const {moongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

//1. our server
var app = express();
//needed for Heroku
const port = process.env.PORT;

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

//GET all /todos
app.get('/todos', (req, res) => {
  //then returns a Promise, success callback and error callback
 //the find returns an array of results, we want to convert it an object
  Todo.find().then((todos) => {
    //stick the array of objects on an object that contains a todo property whose value is the todos array
    //{todos: todos}
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  });
});

//GET a specific /todo/:id
app.get('/todos/:id', (req, res) => { //create an ID variable on the request object
  //res.send(req.params); //return the parameters so we can see them for now
  var id = req.params.id //key value pairs (variable => value)

  //validate that the id is valid using isValid
  if(!ObjectID.isValid(id)){
    //invalid object id, return 404
    return res.status(404).send();
  }

  //if valid id, query db using findById
  Todo.findById(id).then((todo) => {
    if(!todo) {
        return res.status(404).send();
    }
    //this returns an object that has a todo property, which has the todo object == {todo: todo}
    //this allows us to add more things to this object if we wanted
    res.send({todo})
  }, () => {
    res.status(400).send();
  });
});

//DELETE by id /todo/:id
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    return res.status(400).send();
  });
});

//UPDATE a todo /todo/:id
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    //using lodash - since we will be updating the todo, we want to prevent
    //the user from doing anything malcious.  And only updating the text property
    //so use _.pick() - pick off the properties we want
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }

    //check the completed property -
    //if setting to completed, then update completedAt property
    //if unsetting it to completed, clear the completedAt property
    if(_.isBoolean(body.completed) && body.completed){ //body.completed == true
      body.completedAt = new Date().getTime(); //javascript timestamp
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    //now update the DB
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) =>{
      if(!todo){
        return res.status(404).send();
      }
      res.send({todo});

    }).catch((e) => {
      res.status(400).send();
    })
});

// POST /users
app.post('/users', (req,res) => {
  var body = _.pick(req.body, ['email', 'password']);
  //create a new user object from our request
   var user = new User(body);

  //save the model to the  db
  user.save().then(() => {
    //generate the auth token and return that value
    return user.generateAuthToken();

  }).then((token) => {
    //this now has the generateAuthToken value
    //set a header x- custom header that contains the token
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//3. start server
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

//export app so our test file can use it.
module.exports = {app};
