var mongoose = require('mongoose');

//tell mongoose we want to use the built in Promise library instead of a 3rd party one.
mongoose.Promise = global.Promise;

//similar to mongodb connect.  But takes care of the connection for us when
//we make DB calls
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

//expose the mongose object above if other files need to use it.
module.exports = {mongoose};
