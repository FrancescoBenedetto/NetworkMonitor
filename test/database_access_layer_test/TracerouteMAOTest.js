var DbConnection = require('../../database_access_layer/DbConnection');
var TracerouteMAO = require('../../database_access_layer/TracerouteMAO');
var assert = require('assert');

describe('Measurement MongoAccessObject Test', function(){

  var collection, collections, measurement, mmao, dbb, new_path;

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
    new_path = ['111.222.333.444'];
    var dbc = new DbConnection('TEST');
    dbc.connect(function(db){
      dbb = db;
      collections = dbc.setTestCollections(db);
      collection = collections.measurement;
      mmao = new TracerouteMAO(collection);
      done();
    })
  })

  after(function(done){
    //collection.remove({});
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

  it('update timestamp and path by id', function(done){
    mmao.insertJson(measurement);
    setTimeout(function(){
      mmao.updateTimestampAndResultById(measurement, measurement.timestamp + 1, new_path);
    }, 300);
    setTimeout(function(){
      mmao.findById(measurement, function(res) {
        assert.notEqual(measurement.timestamp, res.timestamp);
        assert.notEqual(measurement.path.length, res.path.length);
        assert.equal(measurement.timestamp + 1, res.timestamp);
        done();
      });
    }, 500);
  })

  it('update timestamp and path by _id', function(done){
    mmao.insertJson(measurement);
    mmao.findById(measurement, function(res){
      mmao.updateTimestampAndResultBy_id(res, measurement.timestamp+1, new_path);
      mmao.findById(res, function(res){
        assert.notEqual(measurement.timestamp, res.timestamp);
        assert.notEqual(measurement.path.length, res.path.length);
        done();
      });
    });
  });


})
