//you can destructure something out of an object and store it inside of a variable.
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //findOneAndUpdate example
  //refer to documentation http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#findOneAndUpdate
  //for paramters.
  //2nd parameter needs valid mongodb update operator: https://docs.mongodb.com/manual/reference/operator/update/
  // we will use $set operator
  //3rd paramter is options.  We will set returnOriginal to false so we return the modified value
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('59f61b6c9a7bcb74c345f5e7')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // })

  //challenge - update name in users collection, increment age by one
  db.collection('Users').findOneAndUpdate({
    name: 'Snickers'
  }, {
    $set : {
      name: 'Janine'
    },
    $inc : {
      age: -10
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  //db.close();
});
