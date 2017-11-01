//you can destructure something out of an object and store it inside of a variable.
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    console.log(result);
  });

  // deleteOne - the first one it finds
  db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    console.log(result);
  });

  //findOneAndDelete - returns the document back so you can display it
  // it's inside the value property of the object returned
  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result);
  });

  //challenge - deleteMany based on name, findOneAndDelete based on ID

  //delete many example
  db.collection('Users').deleteMany({name: 'Janine'}).then((result) => {
    console.log(result);
  });

  //find one and delete example
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('59f514aa0a373a070c3f48b6')
  }).then((result) => {
    console.log(result);
  });


  //db.close();
});
