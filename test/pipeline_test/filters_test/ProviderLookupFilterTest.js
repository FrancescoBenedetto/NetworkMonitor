require('rootpath')();

var DB = require('database_access_layer/PostgresqlDbConnection');
var ProviderSAO = require('database_access_layer/ProviderPsqlDAO');
var FakeServerSocket = require('test/pipeline_test/FakeServerSocket');
var ProviderLookupFilter = require('pipeline/filters/ProviderLookupFilter');
var assert = require('assert');



describe('Lookup Filter Test', function(){

  var pdao, serverSocket, collection, measurement, incoming_measurement, mmao, db, filter, af2ips,
      af2ips6, af2ips1, af2ips2, af2ips3, af2ips4, af2ips5;

  before(function(done){

    af2ips = {af : 4 , ips : ["93.48.249.105"]};
    af2ips1 = {af : 4, ips : ["213.224.206.81", "93.48.249.105"]};
    af2ips2 = {af : 4, ips : ["*", "93.48.249.105"]};
    af2ips3 = {af : 4, ips : ["93.48.249.105", "*"]}
    af2ips4 = {af : 4, ips : ["192.168.1.1", "93.48.249.105"]};
    af2ips5 = {af:4, ips : ["10.0.0.1", "192.168.1.1"]};
      af2ips6 = {af:6, ips : ["2001:200:134:aaaa::a", "2001:2b8:47:8000::b"]};


    db = new DB();
    pdao = new ProviderSAO(db);
    serverSocket = new FakeServerSocket();
    filter = new ProviderLookupFilter(pdao, serverSocket);
    done();
    });


  it('perform a lookup with 1 given ips', function(done){
      filter.execute(af2ips, function(err,res) {
        assert.notEqual(res, null);
        assert.equal(res, "Fastweb SpA");
        //assert.equal(true, serverSocket.getStatus());
        done();
      });
  });

  it('perform a lookup with a couple of ips', function(done){
    filter.executeCouple(af2ips1, function(err, res){
      if(err) {
        throw err;
      }
      assert.equal(res.length, 2);
      assert.equal(res[1], "Telenet N.V.");
      assert.equal(res[0], "Fastweb SpA");
      done();
    })
  });

    it('perform a lookup with a couple containing an * in 1st pos', function(done){
        filter.executeCouple(af2ips2, function(err, res){
            if(err){
                throw err;
            }
            assert.equal(res.length, 2);
            assert.equal(res[0], '*');
            assert.equal(res[1], "Fastweb SpA");
            done();
        });
    });

    it('perform a lookup with a couple containing an * in 2nd pos', function(done){
        filter.executeCouple(af2ips3, function(err, res){
            if(err) {
                throw err;
            }
            assert.equal(res.length, 2);
            assert.equal(res[1], "Fastweb SpA");
            assert.equal(res[0], '*');
            done();
        });
    });

    it('perform a lookup with a couple containing an unknown in 2nd pos', function(done){
        filter.executeCouple(af2ips4, function(err, res){
            if(err) {
                throw err;
            }
            assert.equal(res.length, 2);
            assert.equal(res[0], "Fastweb SpA");
            assert.equal(res[1], 'Unknown');
            done();
        });
    });

    it('perform a lookup with a couple containing 2 unknown', function(done){
        filter.executeCouple(af2ips5, function(err, res){
            if(err) {
                throw err;
            }
            assert.equal(res.length, 2);
            assert.equal(res[1], "Unknown");
            assert.equal(res[0], 'Unknown');
            done();
        });
    });

    it('perform a lookup with a couple containing 2 valid ipv6 addresses', function(done){
        filter.executeCouple(af2ips6, function(err, res){
            assert.equal(res.length, 2);
            assert.equal(res[0], "WIDE Project");
            assert.equal(res[1], "Korea Internet Security Agency");
            done();
        });
    });

})
