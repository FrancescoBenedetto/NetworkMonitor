/**
 * Created by francesco on 19/04/16.
 */

/**
 * Created by francesco on 08/04/16.
 */
require('rootpath')();
var PingTrackerFilter = require('pipeline/filters/PingTrackedFilter');
var FakeServerSocket = require('test/pipeline_test/FakeServerSocket');
var assert = require('assert');


describe('Compare ping Filter Test', function(){

    var  m1, filter, max_time,
        action2ping1, action2ping2;

    before(function(done){


        filter = new PingTrackerFilter(new FakeServerSocket());
        max_time=filter.max_time;

        m1 = {
            "timestamp" : (Math.floor(filter.max_time + 20000)/1000),
            "src" : "2a00:ff0:1234:3::2",
            "dst" : "2a02:80e0:0:c::de",
            "id" : "2a00:ff0:1234:3::2_2a02:80e0:0:c::de",
            "result" : 67.8973353333,
            "af" : 6,
            prb_id : 6170,
            providers : ['Fastweb', 'Telecom']
        };
        
        action2ping1 = {action:'inserted', ping:m1};



        done();
    });

    after(function(done){
        done();
    })

    afterEach(function(done){
        filter.tracked_pings = [];
        filter.max_time = max_time;
        done();
    })

    it('inserted with timestamp higher than max time', function(done){
        filter.execute(action2ping1, function(res){
            assert.equal(filter.max_time, action2ping1.ping.timestamp);
            done();
        });

    });




});

