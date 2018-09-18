process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http'
import { app } from '../../src/index';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
const should = chai.should();

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

// });

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
});