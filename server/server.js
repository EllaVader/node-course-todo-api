var mongoose = require('mongoose');

//tell mongoose we want to use the build in Promise library instead of a 3rd party one.
mongoose.Promise = global.Promise;

//similar to mongodb connect.  But takes care of the connection for us when
//we make DB calls
mongoose.connect('mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
});

//create a mongoose model so it knows how to store our data
var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

//create a new Todo object model
var newTodo = new Todo({
  text: 'Update checkbook',
  completed: true,
  completedAt: 10292017
});

//save object to DB
newTodo.save().then((doc) => {
  console.log('Saved todo', doc);
},
(err)=> {
  console.log('Unable to save todo');
});
