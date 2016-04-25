/**
 * Created by francesco on 22/04/16.
 */
/**
 * Created by francesco on 19/04/16.
 */

/**
 * Created by francesco on 08/04/16.
 */
require('rootpath')();
var ProviderNamesTracker = require('pipeline/filters/ProviderTrackerFilter');
var assert = require('assert');


describe('Compare ping Filter Test', function(){

    var  providers1, providers2, providers3, action2ping, filter;

    before(function(done){


        filter = new ProviderNamesTracker();

        providers1 = ['Telecom', 'Fastweb'];
        providers2 = ['Unknown', 'Fastweb'];
        providers3 = ['Telecom', 'Tiscali'];

        action2ping = {action:'remove', ping: {id:1235, providers : providers1}};
        done();
    });

    after(function(done){
        done();
    })

    afterEach(function(done){
        filter.trackingProviders = [];
        done();
    })

    it('insert couple and prepare with english words', function(done){
        filter.insertCouple(providers1);
        assert.equal(filter.trackingProviders[1].name, providers1[1]);
        assert.equal(filter.trackingProviders[1].nominations, 1);
      //  console.log(filter.prepareWordsToStream());
        done();
    });

    it('insert for the second time', function(done){
        filter.insertCouple(providers1);
        filter.insertCouple(providers2);
        assert.equal(filter.trackingProviders[1].name, providers1[1]);
        assert.equal(filter.trackingProviders[1].nominations, 2);
        assert.equal(filter.trackingProviders.indexOf('Unknown'), -1);
       // console.log(filter.prepareWordsToStream());
        done();
    });

    it('should remove correctly', function(done){
        filter.insertCouple(providers1);
        filter.insertCouple(providers2);
        filter.removeCouple(providers1);
        console.log(filter.trackingProviders);
        assert.equal(filter.trackingProviders[0].name, providers1[1]);
        assert.equal(filter.trackingProviders[0].nominations, 1);
        assert.equal(filter.trackingProviders.indexOf(providers1[0]), -1);
        assert.equal(filter.trackingProviders.length, 1);
        //console.log(filter.prepareWordsToStream());
        done();    });

    it('', function(done){
        filter.insertCouple(providers1);
        filter.execute(action2ping, function(err, res){
            assert.equals(filter.trackingProviders.length, 0);
            done()
        });
    });




});

