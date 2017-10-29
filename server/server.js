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
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

var newUser = new User({
  email: '  janine.roe@gmail.com  '
});

newUser.save().then((doc) => {
  console.log('Saved new user', doc);
}, (err) => {
  console.log('Unble to save new user', err)
})

//create a new Todo object model. typecasting exists so if set a string with a Boolean
//or a number it will cast it to a string.  it will not do it for objects though
// var newTodo = new Todo({
//   text: true
// });

//save object to DB
// newTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// },
// (err)=> {
//   console.log('Unable to save todo');
// });
