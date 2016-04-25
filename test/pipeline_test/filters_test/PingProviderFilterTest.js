/**
 * Created by francesco on 18/04/16.
 */

require('rootpath')();

var DB = require('database_access_layer/PostgresqlDbConnection');
var ProviderSAO = require('database_access_layer/ProviderPsqlDAO');
var FakeServerSocket = require('test/pipeline_test/FakeServerSocket');
var ProviderLookupFilter = require('pipeline/filters/PingProviderFilter');
var assert = require('assert');



describe('Lookup Filter Test', function(){

    var pdao, serverSocket, collection, measurement, incoming_measurement, mmao, db, filter, action2ping1, action2ping2,
        action2ping3, action2ping4, action2ping5, action2ping6, af2ips2, af2ips3, af2ips4, af2ips5;

    before(function(done){

        af2ips2 = {af : 4, ips : ["*", "93.48.249.105"]};
        af2ips3 = {af : 4, ips : ["93.48.249.105", "*"]}
        af2ips4 = {af : 4, ips : ["192.168.1.1", "93.48.249.105"]};
        //af2ips5 = {af:4, ips : ["10.0.0.1", "192.168.1.1"]};

        action2ping1 = { action:'inserted' ,ping: {af : 4, src : '', dst : "93.48.249.105" } };
        action2ping2 = { action:'inserted' ,ping: {af : 4, src : '213.224.206.81', dst : "93.48.249.105" } };
        action2ping3 = { action:'inserted' ,ping: {af : 4, src : '*', dst : "93.48.249.105" } };
        action2ping4 = { action:'inserted' ,ping: {af : 6, src : "2001:200:134:aaaa::a", dst : "2001:2b8:47:8000::b" } };
        action2ping5 = { action:'deleted' ,ping: {af : 6, src : "2001:200:134:aaaa::a", dst : "2001:2b8:47:8000::b" } };
        action2ping6 = {action:'inserted' ,ping: {af : 4, src : "10.0.0.1", dst : "192.168.1.1" }};





        db = new DB();
        pdao = new ProviderSAO(db);
        filter = new ProviderLookupFilter(pdao);
        done();
    });


    it('shouldnt perform the lookup: action is deleted', function(done){
        filter.execute(action2ping5, function(err, res){
            assert.equal(res.ping.providers, null);
            assert.notEqual(res, null);
            assert.equal(res.ping.id, action2ping5.ping.id);
           done();
        });
    });

    it('perform a lookup with 1 given ips', function(done){
        filter.execute(action2ping1, function(err, res) {
            assert.notEqual(res, null);
            //console.log(res);
            assert.equal(res.ping.providers[0], 'Unknown')
            assert.equal(res.ping.providers[1], "Fastweb SpA");
            done();
        });
    });


    it('perform a lookup with a couple of ips', function(done){
        filter.execute(action2ping2, function(err, res){
            if(err) {
                throw err;
            }
            assert.equal(res.ping.providers[1], "Telenet N.V.");
            assert.equal(res.ping.providers[0], "Fastweb SpA");
            done();
        })
    });

    it('perform a lookup with a couple containing an * in 1st pos', function(done){
        filter.execute(action2ping3, function(err, res){
            if(err){
                throw err;
            }
            assert.equal(res.ping.providers[0], 'Unknown');
            assert.equal(res.ping.providers[1], "Fastweb SpA");
            done();
        });
    });
/*
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
*/
    it('perform a lookup with a couple containing 2 unknown', function(done){
        filter.execute(action2ping6, function(err, res){
            if(err) {
                throw err;
            }
            assert.equal(res.ping.providers[1], "Unknown");
            assert.equal(res.ping.providers[0], 'Unknown');
            done();
        });
    });

    it('perform a lookup with a couple containing 2 valid ipv6 addresses', function(done){
        filter.execute(action2ping4, function(err, res){
            assert.equal(res.ping.providers[0], "WIDE Project");
            assert.equal(res.ping.providers[1], "Korea Internet Security Agency");
            done();
        });
    });

})

