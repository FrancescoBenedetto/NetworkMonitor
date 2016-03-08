var DbConnection = require('../../database_access_layer/DbConnection');
var MeasurementMAO = require('../../database_access_layer/MeasurementMAO');
var assert = require('assert');

describe('Measurement MongoAccessObject Test', function(){

  var collection, collections, measurement, mmao, dbb;

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

  it('insert a Json measurement', function(done){
    mmao.insertJson(measurement);
    done();
  })

  it('find a measurement by id', function(done){
    mmao.insertJson(measurement);
    setTimeout(function() {
      mmao.findById(measurement, function(res) {
        assert.equal(measurement.id, res.id);
        done();
      }, 900);
    });
  });

  it('update timestamp by id', function(done){
    mmao.insertJson(measurement);
    setTimeout(function(){
      mmao.updateTimestampById(measurement , measurement.timestamp+1);
    }, 300);
    setTimeout(function(){
      mmao.findById(measurement, function(res) {
        assert.notEqual(measurement.timestamp, res.timestamp);
        assert.equal(measurement.timestamp + 1, res.timestamp);
        done();
      });
    }, 500);
  })

  it('update timestamp by _id', function(done){
    mmao.insertJson(measurement);
    mmao.findById(measurement, function(res){
      mmao.updateTimestampBy_id(res, measurement.timestamp+1);
      mmao.findById(res, function(res){
        assert.notEqual(measurement.timestamp, res.timestamp);
        done();
      });
    });
  });


})
