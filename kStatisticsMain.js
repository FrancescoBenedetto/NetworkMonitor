/**
 * Created by francesco on 02/05/16.
 */
require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var AtlasConnection = require('atlas_access_layer/AtlasConnection');
var PingPipelineFactory = require('factory/PingPipelineFactory');




//set up connectors
//Mongodb
var dbConn = new DbConnection('PRODUCTION');
//Atlas (connects automatically)
var atlasConn = new AtlasConnection();

//connect to db
dbConn.connect(function(db){

    //init the collections
    var collections = dbConn.setCollections(db);
    //init ping pipeline
    var ping_collections = collections.ping;
    var ppFactory = new PingPipelineFactory(ping_collections.most_recent_measurement, ping_collections.couples);
    var pingPipeline = ppFactory.createStats();
    var status_collection = db.collection('ping_status_collection');
    //set Atlas' event reciever
    atlasConn.setEventReciever(function(measurement){
        if(measurement.type=='ping'){
            pingPipeline.execute(measurement,
                function(err, res){
                    if(err){
                        throw err;
                    }
                    status_collection.insertOne(res);
                    //console.log(res);
                    //-------------
                });
        }

    });

    
    setTimeout(function(){
        atlasConn.unsubscribeToChannels();
        if(pingPipeline.statusKeeper.observation_status.length > 0){
            status_collection.insertMany(pingPipeline.statusKeeper.observation_status);
        }
        console.log('time ended');
    }, 10*60*60*1000);

});

