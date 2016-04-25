require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var TracerouteMAO = require('database_access_layer/TracerouteMAO');
var MeasurementCouplesMAO = require('database_access_layer/MeasurementCouplesMAO');
var ProviderMAO = require('database_access_layer/ProviderPsqlDAO');
var psql = require('database_access_layer/PostgresqlDbConnection')
var FakeServerSocket = require('test/pipeline_test/FakeServerSocket');
var TraceroutePipeline = require('pipeline/TraceroutePipeline');
var assert = require('assert');



describe('Traceroute Pipeline Test', function(){

  var providers_collection, measurement_collections, couples_collection,
   measurement_collection, incoming_measurement, mmao, dbb, pipeline, m1;

  before(function(done){
    m1 = { "id" : "168.243.14.106_94.186.178.253",
                    "timestamp" : 1457113879,
                    "src" : "168.243.14.106",
                    "dst" : "94.186.178.253",
                    "path" : [
                              "93.48.249.105",
                              "168.243.14.110",
                              "10.131.134.26"
                             ],
        'af': 4
                  };

    m2 = { "id" : "168.243.14.106_94.186.178.253",
            "timestamp" : 1457113880,
            "src" : "168.243.14.106",
            "dst" : "94.186.178.253",
            "path" : [
                "93.48.249.105",
                "168.243.14.110",
                "10.131.134.26"
                    ],
        af : 4
                  };

                  m3 = { "id" : "168.243.14.106_94.186.178.253",
                          "timestamp" : 1457113880,
                          "src" : "168.243.14.106",
                          "dst" : "94.186.178.253",
                          "path" : [
                              "93.48.249.105",
                              "168.243.14.110",
                              "11.131.134.26"
                                  ],
                      af : 4
                                };




    var dbc = new DbConnection('TEST');
    dbc.connect(function(db){
      dbb = db;
      providers_collection = db.collection('providers');
      measurement_collections = dbc.setTestCollections(db);
      couples_collection = measurement_collections.couples;
      measurement_collection = measurement_collections.measurement;
      pmao = new ProviderMAO(new psql());
      mmao = new TracerouteMAO(measurement_collection);
      cmao = new MeasurementCouplesMAO(couples_collection);
      serverSocket = new FakeServerSocket();
      pipeline = new TraceroutePipeline(mmao, cmao, pmao, serverSocket);
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


  it('it\'s the first traceroute with this src and dst', function(done){
    setTimeout(function(){
      pipeline.execute(m1);
    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(res, null);
        assert.equal(m1.id, res.id);
        done();
      });
    }, 500)
  })
/*
  it('there\'s an existing traceroute with this src and dst, is older and has the same path', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      pipeline.execute(m2);
    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(null, res);
        assert.equal(m2.timestamp, res.timestamp);
        cmao.findOneById(m1, function(couple){
          assert.equal(null, couple);
          done()
        })
      })
    }, 500);
  });
*/
  it('there\'s an existing traceroute with this src and dst, is older and has a different path', function(done){
    mmao.insertJson(m1);
    setTimeout(function(){
      pipeline.execute(m3);
    }, 300);
    setTimeout(function(){
      mmao.findById(m1, function(res){
        assert.notEqual(null, res);
        //path updated
        assert.equal(res.path[2], m3.path[2]);
        assert.notEqual(res.path[2], m1.path[2]);
        //timestamp updated
        assert.equal(res.timestamp, m3.timestamp);
        //client alerted
        assert.ok(serverSocket.getStatus());
        cmao.findOneById(m1, function(couple){
          //couple has been inserted
          assert.notEqual(null, couple);
          //check couple timestamps
          assert.equal(m3.timestamp, couple.newer_timestamp);
          assert.equal(m1.timestamp, couple.older_timestamp);
          //check couple paths
          assert.equal(m3.path[2], couple.newer_path[2]);
          assert.equal(m1.path[2], couple.older_path[2]);
          done();
        })

      })
    }, 400);
  })

});
