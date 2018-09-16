import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http'
import { app } from '../../src/index';

chai.use(chaiAsPromised);
chai.use(chaiHttp);
const should = chai.should();

describe('routes : index', function() {
  describe('GET /', function() {
    it('should return json', function(done){
      chai.request(app.callback()).get('/')
      .end((err,res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.equal('success');
        res.body.message.should.eql('hello, world!');
        done();
      })
    })
  })
});
