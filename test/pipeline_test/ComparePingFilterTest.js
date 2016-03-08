require('rootpath')();
var PingMAO = require('database_access_layer/PingMAO');
var MeasurementCouplesMAO = require('database_access_layer/MeasurementCouplesMAO');
var DbConnection = require('database_access_layer/DbConnection');
var ComparePingFilter = require('pipeline/filters/ComparePingFilter');
var FakeServerSocket = require('test/pipeline_test/FakeServerSocket');
var assert = require('assert');


describe('Compare ping Filter Test', function(){

  var measurementCollection, couplesCollection, collections, measurement, m2, mmao, cmao, dbb, filter, serverSocket;

  before(function(done){

    m1 = {
	"timestamp" : 1457114042,
	"src" : "2a00:ff0:1234:3::2",
	"dst" : "2a02:80e0:0:c::de",
	"id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
	"result" : 67.8973353333,
};

  m2 = {
        "timestamp" : 1457114043,
        "src" : "2a00:ff0:1234:3::2",
        "dst" : "2a02:80e0:0:c::de",
        "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
        "result" : "error",
        };

    m3 = {
          "timestamp" : 1457114043,
          "src" : "2a00:ff0:1234:3::2",
          "dst" : "2a02:80e0:0:c::de",
          "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
          "result" : 67.8973353333,
          };

    serverSocket = new FakeServerSocket();
    var dbc = new DbConnection('TEST');
    dbc.connect(function(db){
      dbb = db;
      collections = dbc.setTestCollections(db);
      measurementCollection = collections.measurement;
      couplesCollection = collections.couples;
      mmao = new PingMAO(measurementCollection);
      cmao = new MeasurementCouplesMAO(couplesCollection);
      filter = new ComparePingFilter(mmao, cmao, serverSocket);
      done();
    })
  })

  after(function(done){
    //collection.remove({});
    dbb.close();
    done();
  })

  afterEach(function(done){
    serverSocket.reset();
    couplesCollection.deleteMany({}, function(err, res){
      if(err)
        throw err;
        measurementCollection.deleteMany({}, function(err, res){
          if(err){
            throw err;
          }

          done();
        });
    });
  })

  it('incoming ping is newer, but has an equal result', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      filter.execute({incoming: m3, found : m1}, function(){});
    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(res, null);
        assert.notEqual(m1.timestamp, res.timestamp);
        assert.equal(m1.result, res.result);
        assert.equal(m2.timestamp, res.timestamp);
        done();
      });
    }, 500)
  })

  it('incoming ping is newer and has an different result, testing measurement insertion', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      filter.execute({incoming: m2, found : m1}, function(){});

    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(res, null);
        assert.notEqual(m1.timestamp, res.timestamp);
        assert.notEqual(m1.result, res.result);
        assert.equal(m2.timestamp, res.timestamp);
        assert.equal(m2.result, res.result);
        done();
      });
    }, 500)
  });

  it('incoming ping is newer and has an different result, testing couples insertion', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      filter.execute({incoming: m2, found : m1}, function(){});
    }, 300);
    setTimeout(function(){
      cmao.findOneById(m1, function(res){
        assert.notEqual(res, null);
        assert.equal(m1.timestamp, res.older_timestamp);
        assert.equal(m2.timestamp, res.newer_timestamp);
        assert.equal(m1.result, res.older_result);
        done();
      });
    }, 500)
  });


  it('incoming ping is older and has an different result, it mustn\'t to be inserted', function(done){
    mmao.insertJson(m2);
    setTimeout(function(){
      filter.execute({incoming: m1, found : m2}, function(){});
    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(res, null);
        assert.equal(m2.timestamp, res.timestamp);
        assert.notEqual(m1.timestamp, res.timestamp);
        assert.equal(m2.result, res.result);
        done();
      });
    }, 500)
  });


  it('incoming ping is newer and has an different result, should be sent an alert', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      filter.execute({incoming: m2, found : m1}, function(){});
    }, 300);
    setTimeout(function(){
      assert.equal(true, serverSocket.getStatus());
      done();
    }, 500)
  });







})
