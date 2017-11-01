const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo'); //our data model from mongoose

//seed tests data
const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
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
