const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo'); //our data model from mongoose

//setup - part of Mocha - gets run before each test case
beforeEach((done) => { //async call, need done
  //wipe the db before starting our test remove({}) wipes the whole DB
  Todo.remove({}).then(() => done());
});

//happy path test
  describe('POST /todos', () => {
    it('it should create a new todo', (done) => {
      var text = 'Test todo text';

      request(app)
        .post('/todos')
        .send({text}) //with a post you need to send something - JSON
        .expect(200)
        .expect((res) => { //custom expect which passes in the response as an arg
          expect(res.body.text).toBe(text);
        })
        .end((err, res) => { //call end not done yet, because we also want to assert that the todo got inserted into the DB, so now check for that
          if(err){
            return done(err);
          }

          Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0); //db should be empty
          done();
        }).catch((e) => done(e));
      });

  });

});
