require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var ProviderLookupFilter = require('pipeline/filters/ProviderLookupFilter');
var ProviderMAO = require('database_access_layer/ProviderMAO');
var FakeServerSocket = require('test/pipeline_test/FakeServerSocket')
var assert = require('assert');



describe('Lookup Filter Test', function(){

  var collection, measurement, incoming_measurement, mmao, dbb, filter;

  before(function(done){

    ips = [
              "93.48.249.105"
            ];

    var dbc = new DbConnection('PRODUCTION');
    dbc.connect(function(db){
      dbb = db;
      collection = db.collection('providers');
      pmao = new ProviderMAO(collection);
      serverSocket = new FakeServerSocket();
      filter = new ProviderLookupFilter(pmao, serverSocket);
      done();
    })
  })

  after(function(done){
    dbb.close();
    done();
  })


  it('perform a lookup with some given ips', function(done){
      filter.execute(ips, function(res) {
        console.log(res);
        assert.notEqual(res, null);
        assert.equal(res, "Fastweb SpA");
        assert.equal(true, serverSocket.getStatus())
        done();
      });
  });


})
