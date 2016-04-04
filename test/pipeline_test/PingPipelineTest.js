require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var PingMAO = require('database_access_layer/PingMAO');
var MeasurementCouplesMAO = require('database_access_layer/MeasurementCouplesMAO');
var ProviderSAO = require('database_access_layer/ProviderSAO');
var MysqlConnection = require('database_access_layer/MysqlDbConnection');
var FakeServerSocket = require('test/pipeline_test/FakeServerSocket');
var PingPipeline = require('pipeline/PingPipeline');
var assert = require('assert');



describe('Ping Pipeline Test', function(){

  var providers_collection, measurement_collections, couples_collection, mysql, pdao, serverSocket, cmao,
   measurement_collection, incoming_measurement, mmao, dbb, pipeline, m1, m2, m3, m4, m5;

  before(function(done){
    m1 = {
        "timestamp" : 1457114042,
        "src" : "2a00:ff0:1234:3::2",
        "dst" : "2a02:80e0:0:c::de",
        "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
        "result" : 67.8973353333,
      "af" : 6
    };

  m2 = {
        "timestamp" : 1457114043,
        "src" : "2a00:ff0:1234:3::2",
        "dst" : "2a02:80e0:0:c::de",
        "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
        "result" : "error",
    "af":6
        };

        m3 = {
              "timestamp" : 1457114044,
              "src" : "2a00:ff0:1234:3::2",
              "dst" : "2a02:80e0:0:c::de",
              "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
              "result" : 67.8973353333,
          "af":6
              };
      m4 = {
          "timestamp" : 1457114043,
          "src" : "213.224.206.81",
          "dst" : "93.48.249.105",
          "id" : "",
          "result" : 67.8973353333,
          "af":4
      }

      m5 = {
          "timestamp" : 1457114044,
          "src" : "213.224.206.81",
          "dst" : "93.48.249.105",
          "id" : "",
          "result" : "error",
          "af":4
      }




    var dbc = new DbConnection('TEST');
    dbc.connect(function(db){
      dbb = db;
      mysql = new MysqlConnection();
      measurement_collections = dbc.setTestCollections(db);
      couples_collection = measurement_collections.couples;
      measurement_collection = measurement_collections.measurement;
      pdao = new ProviderSAO(mysql.connect());
      mmao = new PingMAO(measurement_collection);
      cmao = new MeasurementCouplesMAO(couples_collection);
      serverSocket = new FakeServerSocket();
      pipeline = new PingPipeline(mmao, cmao, pdao, serverSocket);
      done();
    })
  })

  after(function(done){
    //dbb.close();
    done();
  })


  afterEach(function(done){
    serverSocket.reset();
    couples_collection.deleteMany({}, function(err, res){
      if(err)
        throw err;
        measurement_collection.deleteMany({}, function(err, res){
          if(err){
            throw err;
          }

          done();
        });
    });
  })


  it('it\'s the first Ping with this src and dst', function(done){
    setTimeout(function(){
      pipeline.execute(m1, function(err, res){});
    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(res, null);
        assert.equal(m1.id, res.id);
        done();
      });
    }, 500)
  })

  it('there\'s an existing Ping with this src and dst, is older and has a normal result', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      pipeline.execute(m2, function(err, res){});
    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(null, res);
        //path updated
        assert.equal(res.result, m2.result);
        assert.notEqual(res.result, m1.result);
        //timestamp updated
        assert.equal(res.timestamp, m2.timestamp);
        //client alerted
        assert.ok(serverSocket.getStatus());
        cmao.findOneById(m1, function(couple){
          //couple has been inserted
          assert.notEqual(null, couple);
          //check couple timestamps
          assert.equal(m2.timestamp, couple.newer_timestamp);
          assert.equal(m1.timestamp, couple.older_timestamp);
          //check couple paths
          assert.equal(m2.result, couple.newer_result);
          assert.equal(m1.result, couple.older_result);
          done();
        })

      })
    }, 400);
  })


  it('there\'s an existing Ping with this src and dst, is older and has an error result', function(done){
    mmao.insertJson(m2);
    setTimeout(function(){
      pipeline.execute(m3, function(){});
    }, 300);
    setTimeout(function(){
      mmao.findById(m2, function(res){
        assert.notEqual(null, res);
        //result updated
        assert.equal(res.result, m3.result);
        assert.notEqual(res.result, m2.result);
        //timestamp updated
        assert.equal(res.timestamp, m3.timestamp);
        //client alerted
        assert.ok(serverSocket.getStatus());
        cmao.findOneById(m3, function(couple){
          //couple has been inserted
          assert.notEqual(null, couple);
          done();
        })

      })
    }, 400);
  });

    it('should return 2 providers', function(done){
        mmao.insertJson(m4);
        setTimeout(function(){
            pipeline.execute(m5, function(err, res){
                assert.equal(res[0], "Telenet N.V.");
                assert.equal(res[1], "Fastweb SpA");
                done();
            });
        }, 300);
    })

});
