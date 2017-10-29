//const MongoClient = require('mongodb').MongoClient;
//you can destructure something out of an object and store it inside of a variable.
const {MongoClient, ObjectID} = require('mongodb');
//we can create object Ids like this
// var obj = new ObjectID();
// console.log(obj);

//you can destructure something out of an object and store it inside of a variable.
// var user = {name: 'Janine', age: 48};
// var {name} = user;
// console.log(name);

//if the TodoApp db doesn't exist, mongo will create it (once we start actually
//adding data into it)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //create a new collection in our TodoApp db
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //   //ops stores all the docs that were inserted
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  //insert new doc into Users collection name, age, location
  //you can add your own id if you want.
  // db.collection('Users').insertOne({
  //   //_id: 123,
  //   name: 'Janine',
  //   age: 48,
  //   location: 'Glenmoore, PA'
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert into Users', err);
  //   }
  //   //console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  db.close();
});
