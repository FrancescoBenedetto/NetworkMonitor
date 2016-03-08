var DbConnection = require('../../database_access_layer/DbConnection');
var PingMAO = require('../../database_access_layer/PingMAO');
var assert = require('assert');

describe('Measurement MongoAccessObject Test', function(){

  var collection, collections, measurement, mmao, dbb, new_result;

  before(function(done){

    measurement = {
                	"timestamp" : 1457114065,
                	"src" : "195.95.178.138",
                	"dst" : "185.55.228.6",
                	"id" : "195.95.178.138_185.55.228.6",
                	"result" : 13.8676953333,
                };

    new_result = 'error';
    var dbc = new DbConnection('TEST');
    dbc.connect(function(db){
      dbb = db;
      collections = dbc.setTestCollections(db);
      collection = collections.measurement;
      mmao = new PingMAO(collection);
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
      mmao.updateTimestampAndResultId(measurement, measurement.timestamp + 1, new_result);
      mmao.findById(measurement, function(res) {
        assert.notEqual(measurement.timestamp, res.timestamp);
        assert.notEqual(measurement.result, res.result);
        assert.equal(measurement.timestamp + 1, res.timestamp);
        done();
      });
  })

  it('update timestamp and path by _id', function(done){
    mmao.insertJson(measurement);
    mmao.findById(measurement, function(res){
      mmao.updateTimestampAndResultBy_id(res, measurement.timestamp+1, new_result);
      mmao.findById(res, function(res){
        assert.notEqual(measurement.timestamp, res.timestamp);
        assert.notEqual(measurement.result, res.result);
        done();
      });
    });
  });


})
