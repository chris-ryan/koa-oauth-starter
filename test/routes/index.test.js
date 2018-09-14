import * as chai from 'chai';
import * as chaiHttp from 'chai-http'
import { server } from '../src/index';
const should = chai.should();
chai.use(chaiHttp);

describe('routes : index', function() {
  describe('GET /', function() {
    it('should return json', function(done){
      chai.request(server).get('/')
      .end((err,res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.equal('success');
        res.body.message.should.eql('hello, world!');
        done();
      })
    })
  }
});
