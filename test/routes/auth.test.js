
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http'
// import dotenv from 'dotenv';
import { app } from '../../src/index';
import User from '../../src/api/users/model';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
const should = chai.should();
// dotenv.config();

// const knex = require('../src/server/db/connection');

describe('routes : auth', function() {

//   beforeEach(() => {
//     return knex.migrate.rollback()
//     .then(() => { return knex.migrate.latest(); })
//     .then(() => { return knex.seed.run(); });
//   });

//   afterEach(() => {
//     return knex.migrate.rollback();
//   });

  describe('GET /auth/login', function() {
    it('should render the login view', function(done) {
      chai.request(app.callback())
      .get('/auth/login')
      .end((err, res) => {
        should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('text/html');
        res.text.should.contain('<h1>Login</h1>');
        res.text.should.contain(
          '<p><button type="submit">Log In</button></p>');
        done();
      });
    });
  });

  describe('user-interactions', function() {
    let user = {};
    before(function seedTestUser() {
      let username = 'example';
      let passwordHash = User.hashPassword('abacus');
      user = new User({
        username,
        passwordHash,
      });
      user.save();
    });
    describe('POST /auth/login', () => {
      it('should login a user', (done) => {
        chai.request(app.callback())
        .post('/auth/login')
        .send({
          username: 'example',
          password: 'abacus'
        })
        .end((err, res) => {
          res.redirects[0].should.contain('/auth/status');
          done();
        });
      });
    });
    after(async function deleteTestUser(){
      user.delete().then(()=> {
        console.log('test user deleted');
      }).catch((err) => {console.error(err)}); 
    })
  })
});