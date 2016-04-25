/**
 * Created by francesco on 08/04/16.
 */
require('rootpath')();
var StatusKeeperFilter = require('pipeline/filters/StatusKeeperFilter2');
var assert = require('assert');


describe('Compare ping Filter Test', function(){

    var  m1, m2, m3, m4, filter;

    before(function(done){


        filter = new StatusKeeperFilter(1);

        m1 = {
            "timestamp" : 1457114042,
            "src" : "2a00:ff0:1234:3::2",
            "dst" : "2a02:80e0:0:c::de",
            "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
            "result" : 67.8973353333,
            "af" : 6,
            prb_id : 6170
        };

        m2 = {
            "timestamp" : 1457114043,
            "src" : "2a00:ff0:1234:3::2",
            "dst" : "2a02:80e0:0:c::de",
            "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
            "result" : "error",
            "af" : 6,
            prb_id : 6170

        };

        m3 = {
            "timestamp" : 1457114043,
            "src" : "2a00:ff0:1234:3::2",
            "dst" : "2a02:80e0:0:c::de",
            "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
            "result" : 67.8973353333,
            "af":6,
            prb_id : 6170

        };

        m4 = {
            "timestamp" : 1457114045,
            "src" : "2a00:ff0:1234:3::2",
            "dst" : "2a02:80e0:0:c::de",
            "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
            "result" : 67.8973353353,
            "af":6,
            prb_id : 6170

        };


            done();
        });

    after(function(done){
        done();
    })

    afterEach(function(done){
        filter.observation_status.array = [];
        filter.tracking_status.array = [];
        filter.setK(1);
        done();
    })

    it('(ok, err)', function(done){
      filter.updateStatus({found:m1, incoming:m2});
        assert.equal(filter.observation_status.array.length, 1);
        assert.equal(filter.observation_status.array[0].k, 0);
        assert.equal(filter.tracking_status.array.length, 0);
        done();
    });

    it('(err, ok) after 0 (err, err)', function(done){
       //insert (ok, err)
        filter.updateStatus({found:m1, incoming:m2});
        filter.updateStatus({found:m2, incoming:m1});
        assert.equal(filter.tracking_status.array.length, 0);
        assert.equal(filter.observation_status.array.length, 0);
        done();
    });

    it('(ok, err) -> (err, err), k=1 so it will be inserted in tracking status', function(done){
       filter.updateStatus({found:m1, incoming:m2});
        filter.updateStatus({found:m2, incoming:m2});
        assert.equal(filter.observation_status.array.length, 0);
        assert.equal(filter.tracking_status.array.length, 1);
        done();
    });

    it('(ok, err) -> (err, err) -> (err, ok) should be removed from the trackeds', function(done){
        filter.updateStatus({found:m1, incoming:m2}, console.log);
        filter.updateStatus({found:m2, incoming:m2}, console.log);
        filter.updateStatus({found:m2, incoming:m1}, console.log);
        assert.equal(filter.observation_status.array.length, 0);
        assert.equal(filter.tracking_status.array.length, 0);
        done();
    });

    it('(ok, err) -> (err, err) -> (err, err) should remain in tracking status', function(done){
        filter.updateStatus({found:m1, incoming:m2});
        filter.updateStatus({found:m2, incoming:m2});
        filter.updateStatus({found:m2, incoming:m2});
        assert.equal(filter.observation_status.array.length, 0);
        assert.equal(filter.tracking_status.array.length, 1);
        done();
    });

    it('(ok, err) -> (err, err) with k = 2', function(done){
        filter.setK(2);
        filter.updateStatus({found:m1, incoming:m2});
        filter.updateStatus({found:m2, incoming:m2});
        assert.equal(filter.observation_status.array.length, 1);
        assert.equal(filter.observation_status.array[0].k, 1);
        assert.equal(filter.tracking_status.array.length, 0);
        done();
    });



});
