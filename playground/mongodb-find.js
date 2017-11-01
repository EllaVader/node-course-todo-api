//you can destructure something out of an object and store it inside of a variable.
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//fetch all the documents in the Todos collection.  toArray returns an
// array of documents with ids etc.  it returns  a promise
// so we have 2 args, one for success, one for failure
  db.collection('Todos').find().toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err)
  });

//fetch all documents that have a status done is false
  db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err)
  });

//fetch by ID -- use the ObjectID object we have from above.
  db.collection('Todos').find({
      _id: new ObjectID('59f60a039a7bcb74c345f0bb')
    }).toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err)
  });

  //count example
  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log('Unable to fetch todos', err)
  });

  //find all documents that have the name 'Janine' in the Users collection
  //remember - it returns a promise.  2 args, success and failure callbacks.
  db.collection('Users').find({name: 'Janine'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  //db.close();
});
