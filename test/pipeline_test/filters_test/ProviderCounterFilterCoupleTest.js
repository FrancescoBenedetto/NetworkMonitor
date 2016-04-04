/**
 * Created by francesco on 30/03/16.
 */

/**
 * Created by francesco on 29/03/16.
 */

require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var ProviderCounterFilter = require('pipeline/filters/TracerouteProviderAnalysisFilter');
var assert = require('assert');



describe('Lookup Filter Test', function(){

    var AA, AB, dbb, asterisk, filter, ABTot, unknown, tot, couple1, couple2, couple3, couple4;

    before(function(done){

        couple1 = ["Fastweb", "Telecom Italia"];
        couple2 = ["*", "Fastweb"];
        couple3 = ["Unknown", "Fastweb"];
        couple4 = ["Fastweb", "Fastweb"];

        var dbc = new DbConnection('PRODUCTION');
        dbc.connect(function(db){
            dbb = db;
             AA = db.collection('AA');
             AB = db.collection('AB');
             asterisk = db.collection('asterisk');
             ABTot = db.collection('ABTot');
             unknown = db.collection('unknown');
             tot = db.collection('total');
            filter = new ProviderCounterFilter(AA, AB, ABTot, asterisk, unknown,  tot);
            done();
        })
    })

    after(function(done){
        dbb.close();
        done();
    });

    afterEach(function(done){
        filter = new ProviderCounterFilter(AA, AB, ABTot, asterisk, unknown,  tot);
        AA.deleteMany({}, function(err, res){
            if(err){
                throw err;
            }
            AB.deleteMany({}, function(err, res){
                if(err){
                    throw err;
                }
                asterisk.deleteMany({});
                ABTot.deleteMany({});
                unknown.deleteMany({});
                tot.deleteMany({}, function(err, res){
                    done();
                })
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


