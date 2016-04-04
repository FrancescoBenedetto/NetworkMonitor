require('rootpath')();
var TracerouteMAO = require('database_access_layer/TracerouteMAO');
var MeasurementCouplesMAO = require('database_access_layer/MeasurementCouplesMAO');
var DbConnection = require('database_access_layer/DbConnection');
var CompareTracerouteFilter = require('pipeline/filters/CompareTracerouteFilter');
var FakeServerSocket = require('test/pipeline_test/FakeServerSocket');
var assert = require('assert');


describe('Compare Traceroute Filter Test', function(){

  var measurementCollection, couplesCollection, collections, measurement, m2, mmao, cmao, dbb, filter, serverSocket;

  before(function(done){

    m1 = { "id" : "168.243.14.106_94.186.178.253",
                    "timestamp" : 1457113879,
                    "src" : "168.243.14.106",
                    "dst" : "94.186.178.253",
                    "path" : [
                              "192.168.0.1",
                              "168.243.14.110",
                              "10.131.134.26"
                             ]
                  };
    m2 = { "id" : "168.243.14.106_94.186.178.253",
                    "timestamp" : 1457113880,
                    "src" : "168.243.14.106",
                    "dst" : "94.186.178.253",
                    "path" : [
                              "168.243.14.110",
                              "10.131.134.26"
                             ]
                  };

    m3 = { "id" : "168.243.14.106_94.186.178.253",
            "timestamp" : 1457113880,
            "src" : "168.243.14.106",
            "dst" : "94.186.178.253",
            "path" : [
              "192.168.0.1",
              "168.243.14.110",
              "10.131.134.26"
                      ]
            };
    serverSocket = new FakeServerSocket();
    var dbc = new DbConnection('TEST');
    dbc.connect(function(db){
      dbb = db;
      collections = dbc.setTestCollections(db);
      measurementCollection = collections.measurement;
      couplesCollection = collections.couples;
      mmao = new TracerouteMAO(measurementCollection);
      cmao = new MeasurementCouplesMAO(couplesCollection);
      filter = new CompareTracerouteFilter(mmao, cmao, serverSocket);
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
/*
  it('incoming traceroute is newer, but has an equal path', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      filter.executeLight({incoming: m3, found : m1}, function(){});
    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(res, null);
        assert.notEqual(m1.timestamp, res.timestamp);
        assert.equal(m1.path.length, res.path.length);
        assert.equal(m2.timestamp, res.timestamp);
        done();
      });
    }, 500)
  })
*/
  it('incoming traceroute is newer and has an different path, testing measurement insertion', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      filter.executeLight({incoming: m2, found : m1}, function(){});

    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(res, null);
        assert.notEqual(m1.timestamp, res.timestamp);
        assert.notEqual(m1.path.length, res.path.length);
        assert.equal(m2.timestamp, res.timestamp);
        assert.equal(m2.path.length, res.path.length);
        done();
      });
    }, 500)
  });

  it('incoming traceroute is newer and has an different path, testing couples insertion', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      filter.executeLight({incoming: m2, found : m1}, function(){});
    }, 300);
    setTimeout(function(){
      cmao.findOneById(m1, function(res){
        assert.notEqual(res, null);
        assert.equal(m1.timestamp, res.older_timestamp);
        assert.equal(m2.timestamp, res.newer_timestamp);
        assert.equal(m1.path.length, res.older_path.length);
        done();
      });
    }, 500)
  });

/*
  it('incoming traceroute is older and has an different path, testing couples insertion', function(done){
    mmao.insertJson(m2);
    setTimeout(function(){
      filter.executeLight({incoming: m1, found : m2}, function(){});
    }, 300);
    setTimeout(function(){
      cmao.findOneById(m1, function(res){
        assert.notEqual(res, null);
        assert.equal(m1.timestamp, res.older_timestamp);
        assert.equal(m2.timestamp, res.newer_timestamp);
        assert.equal(m1.path.length, res.older_path.length);
        done();
      });
    }, 500)
  });
*/
  it('incoming traceroute is older and has an different path, it mustn\'t be inserted', function(done){
    mmao.insertJson(m2);
    setTimeout(function(){
      filter.executeLight({incoming: m1, found : m2}, function(){});
    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(res, null);
        assert.equal(m2.timestamp, res.timestamp);
        assert.notEqual(m1.timestamp, res.timestamp);
        assert.equal(m2.path.length, res.path.length);
        done();
      });
    }, 500)
  });

/*
  it('incoming traceroute is older and has an different path, should be sent an alert', function(done){
    mmao.insertJson(m2);
    setTimeout(function(){
      filter.executeLight({incoming: m1, found : m2}, function(){});
    }, 300);
    setTimeout(function(){
      assert.equal(true, serverSocket.getStatus());
      done();
    }, 500)
  });
*/

  it('incoming traceroute is newer and has an different path, should be sent an alert', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      filter.executeLight({incoming: m2, found : m1}, function(){});
    }, 300);
    setTimeout(function(){
      assert.equal(true, serverSocket.getStatus());
      done();
    }, 500)
  });

  it('should return some ips', function(done){
    filter.executeLight({incoming : m2, found : m1}, function(err, res){
      assert.ok(res.length>0);
      assert.ok(res.indexOf(m1.path[0])!=-1);
      assert.ok(res.indexOf(m2.path[0])!=-1);
      done();
    })
  })






})
