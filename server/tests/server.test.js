const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo'); //our data model from mongoose

//seed tests data
//create our own IDs as some of our tests will need the id
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}]

//setup - part of Mocha - gets run before each test case
beforeEach((done) => { //async call, need done
  //wipe the db before starting our test remove({}) wipes the whole DB
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

//POST tests
describe('POST /todos', () => {
  //happy path test
  it('it should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text}) //with a post you need to send something - JSON
      .expect(200) //supertest expect
      .expect((res) => { //custom expect which passes in the response as an arg
        expect(res.body.text).toBe(text); //expect module expect
      })
      .end((err, res) => { //call end not done yet, because we also want to assert that the todo got inserted into the DB, so now check for that
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
    });

  //error path test - passing in no data to the post
  it('should not create a todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2); //db should only have the 2 test data objects
          done();
        }).catch((e) => done(e));
      });
    });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
          expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

 describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    //create a valid id but it doesn't exist in db
    var id = new ObjectID()//.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var id = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => { //the end expects a callback, with 2 params, err and response
        if(err){
          return done(err);
        }
        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done());
      });
  });

  it('should return a 404 if todo not found', (done) => {
    //create a valid id but it doesn't exist in db
    var id = new ObjectID()//.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if object ID is invalid', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      var id = todos[0]._id;
      var text = 'Updated 1st Task!';
      var completed = true;
      request(app)
        .patch(`/todos/${id}`)
        .send({text, completed})
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true)
          expect(res.body.todo.completedAt).toBeA('number')
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
      var id = todos[1]._id;
      var text = 'Updated 2nd Task!';
      var completed = false;
      request(app)
        .patch(`/todos/${id}`)
        .send({text, completed})
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false)
          expect(res.body.todo.completedAt).toNotExist()
        })
        .end(done);
    });
});
