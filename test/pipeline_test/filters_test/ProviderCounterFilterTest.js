/**
 * Created by francesco on 29/03/16.
 */

require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var ProviderCounterFilter = require('pipeline/filters/ProviderCounterFilter');
var assert = require('assert');



describe('Lookup Filter Test', function(){

    var collectionAA, collectionAB, dbb, filter, providerA, providerB;

    before(function(done){

         providerA = "Fastweb";
         providerB = "Telecom Italia";

        var dbc = new DbConnection('PRODUCTION');
        dbc.connect(function(db){
            dbb = db;
            collectionAA = db.collection('providerAA');
            collectionAB = db.collection('providerAB');
            filter = new ProviderCounterFilter(collectionAA, collectionAB);
            done();
        })
    })

    after(function(done){
        dbb.close();
        done();
    });
    
    afterEach(function(done){
       filter.couple = [];
        filter.counter = 0;
        filter.iAA = 0;
        filter.iAB = 0;
        filter.AA = [];
        filter.AB = [];
        collectionAA.deleteMany({}, function(err, res){
            if(err){
                throw err;
            }
            collectionAB.deleteMany({}, function(err, res){
                if(err){
                    throw err;
                }
                done();
            });
        });

    });


    it('handle A', function(done){
        filter.execute(providerA);
        setTimeout(function(){
            assert.equal(filter.couple[0], providerA);
            assert.ok(filter.couple[1]==null);
            done();
        }, 500);
    });
    
    it('handle AA', function(done){
        filter.execute(providerA);
        filter.execute(providerA);
        collectionAA.find({'A' : providerA}).toArray(function(err, res){
            //assert.equal(filter.couples.length, 0);
            assert.equal(res[0].A, providerA);
            assert.equal(res.length, 1);
            done();
        });
    });

    it('handle AB', function(done){
       filter.execute(providerA);
        filter.execute(providerB);
        collectionAB.find({'A' : providerA}).toArray(function(err, res){
           assert.equal(res[0].A, providerA);
            assert.equal(res[0].B, providerB);
            assert.equal(res.length, 1);
            done();
        });
    });


})

