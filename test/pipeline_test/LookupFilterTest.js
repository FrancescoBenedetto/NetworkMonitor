require('rootpath')();
var MeasurementMAO = require('database_access_layer/MeasurementMAO');
var DbConnection = require('database_access_layer/DbConnection');
var LookupFilter = require('pipeline/filters/LookupFilter');
var assert = require('assert');



describe('Lookup Filter Test', function(){

  var collection, measurement, incoming_measurement, mmao, dbb, filter;

  before(function(done){

    measurement = { "id" : "168.243.14.106_94.186.178.253",
                    "timestamp" : 1457113879,
                    "src" : "168.243.14.106",
                    "dst" : "94.186.178.253",
                    "path" : [
                              "192.168.0.1",
                              "168.243.14.110",
                              "10.131.134.26"
                             ]
                  };

    var dbc = new DbConnection('TEST');
    dbc.connect(function(db){
      dbb = db;
      collections = dbc.setTestCollections(db);
      collection = collections.measurement;
      mmao = new MeasurementMAO(collection);
      filter = new LookupFilter(mmao);
      done();
    })
  })

  after(function(done){
    dbb.close();
    done();
  })

  afterEach(function(done){
    collection.deleteMany({}, function(err, res){
      if(err)
        throw err;

      done();
    });
  })


  it('perform a lookup with an existing measurement', function(done){
    mmao.insertJson(measurement);
    setTimeout(function() {
      filter.execute(measurement, function(res) {
        assert.notEqual(res, null);
        assert.notEqual(res.m1, null);
        assert.notEqual(res.m2, null);
        assert.equal(res.m1.id, res.m2.id);
        done();
      }, 900);
    });
  });

  it('perform a lookup without an existing measurement', function(done){
      filter.execute(measurement, function(){});
      setTimeout(function(){
        mmao.findById(measurement, function(res){
        assert.notEqual(res, null);
        done();
      })
    }, 500);
    });


})
