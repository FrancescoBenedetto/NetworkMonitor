/**
 * Created by francesco on 30/03/16.
 */
require('rootpath')();
var DB = require('database_access_layer/MysqlDbConnection');
var ProviderSAO = require('database_access_layer/ProviderSAO');
var assert = require('assert');



describe('Lookup Filter Test with Mysql', function(){

    var db, connection, pdao, filter, ips, ips2, ips3;

    before(function(done){

        ips = [
            "185.28.220.65",
            "93.48.249.105"
        ];

        ips2 = ["192.168.1.1", "93.48.249.105"];

        ips3 = ["10.0.0.1", "192.168.1.1"];

        db = new DB();
        connection = db.connect();
        pdao = new ProviderSAO(connection);
        done();
    })

    it('perform a lookup with 1 given ips', function(done){
        pdao.findISPByIp("93.48.249.105", function(res){
            assert.notEqual(res, null);
            assert.equal(res, "Fastweb SpA");
            done();
        });
    });

    it('perform a lookup with some ips', function(done){
        pdao.findISPSByIps(ips, function(res){
            assert.equal(res[0], "Booking.com BV");
            assert.equal(res[1], "Fastweb SpA");
            done();
        });
    });

    it('perform a lookup with some ips', function(done){
        pdao.findISPSByIps(ips2, function(res){
            assert.equal(res[0], "Unknown");
            assert.equal(res[1], "Fastweb SpA");
            done();
        });
    });

    it('perform a lookup with some ips', function(done){
        pdao.findISPSByIps(ips3, function(res){
            assert.equal(res[0], "Unknown");
            assert.equal(res[1], "Unknown");
            done();
        });
    });

});
