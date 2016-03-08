var DbConnection = require('../../database_access_layer/DbConnection');
var ProviderMAO = require('../../database_access_layer/ProviderMAO');
var assert = require('assert');

describe('Measurement MongoAccessObject Test', function(){

  var collection, collections, measurement, pmao, dbb, new_path;

  before(function(done){

    ip_address_fastweb = "93.48.249.105";
    var dbc = new DbConnection('PRODUCTION');
    dbc.connect(function(db){
      dbb = db;
      collection = db.collection('providers');
      pmao = new ProviderMAO(collection);
      done();
    })
  })

  after(function(done){
    //collection.remove({});
    dbb.close();
    done();
  })


  it('should return fastweb', function(done){
      pmao.findByIp(ip_address_fastweb, function(res) {
        assert.notEqual(res, null);
        assert.equal(res, "Fastweb SpA");
        done();
      });
  })



})
