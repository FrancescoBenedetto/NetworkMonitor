/**
 * Created by francesco on 03/04/16.
 */
/**
 * Created by francesco on 30/03/16.
 */
require('rootpath')();
var DB = require('database_access_layer/PostgresqlDbConnection');
var ProviderPsqlDAO = require('database_access_layer/ProviderPsqlDAO');
var assert = require('assert');



describe('Lookup Filter Test with Mysql', function(){

    var connection, pdao, ip1, ip1v6, ips, ips2, ips3, ips1_v6, ips2_v6;

    before(function(done){

        ip1 = "93.48.249.105";

        ip1v6 = "2001:200:134:aaaa::a";

        ips = [
            "185.28.220.65",
            "93.48.249.105"
        ];

        ips1_v6 = ["2001:200:134:aaaa::a", "2001:2b8:47:8000::b"];

        ips2_v6 = ["fd60:6862:680a:05c9::b", "2001:200:134:aaaa::a"];

        ips2 = ["192.168.1.1", "93.48.249.105"];

        ips3 = ["10.0.0.1", "192.168.1.1"];

        connection = new DB();
        pdao = new ProviderPsqlDAO(connection);
        done();
    })

    it('perform a lookup with 1 given ips', function(done){
        pdao.findISPbyIpv4(ip1, function(res){
            assert.notEqual(res, null);
            assert.equal(res, "Fastweb SpA");
            done();
        });
    });

    it('perform a lookup with some ips', function(done){
        pdao.findCoupleISPbyIpv4(ips, function(res){
            assert.equal(res[1], "Booking.com BV");
            assert.equal(res[0], "Fastweb SpA");
            done();
        });
    });

    it('perform a lookup with some ips', function(done){
        pdao.findCoupleISPbyIpv4(ips2, function(res){
            assert.equal(res[1], "Unknown");
            assert.equal(res[0], "Fastweb SpA");
            done();
        });
    });

    it('perform a lookup with some ips', function(done){
        pdao.findCoupleISPbyIpv4(ips3, function(res){
            assert.equal(res[1], "Unknown");
            assert.equal(res[0], "Unknown");
            done();
        });
    });

    it('perform a lookup with one ipv6', function(done){
        pdao.findISPbyIpv6(ip1v6, function(res){
            assert.notEqual(null, res);
            assert.equal(res, "WIDE Project");
            done();
        });
    });

    it('perform a lookup with a couple of ipv6', function(done){
        pdao.findCoupleISPbyIpv6(ips1_v6, function(res){
            assert.notEqual(null, res);
            assert.equal(res[0], "WIDE Project");
            assert.equal(res[1], "Korea Internet Security Agency");
            done();
        });
    });

    it('perform a lookup with a couple of ipv6: one public and one private', function(done){
       pdao.findCoupleISPbyIpv6(ips2_v6, function(res){
           assert.notEqual(null, res);
           assert.equal(res[0], "WIDE Project");
           assert.equal(res[1], 'Unknown');
           done();
       })
    });

});
