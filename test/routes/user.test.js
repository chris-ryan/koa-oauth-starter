import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http'
import { app } from '../../src/index';
import User from '../../src/api/users/model';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
const should = chai.should();

describe('routes : user', function() {
  describe('POST /user/register', function() {
    it('should register a new user and return the id', function(done){
      chai.request(app.callback()).post('/user/register')
      .send({ username: 'user-test', password: 'abacus'})
      .end(function (err, res) {
        should.not.exist(err);
        res.status.should.eql(200);
        res.body.should.have.property('id');
        done();
      })
    });
  });
});
