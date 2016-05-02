/**
 * Created by francesco on 30/04/16.
 */
require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var PsqlConnection = require('database_access_layer/PostgresqlDbConnection');
var AtlasConnection = require('atlas_access_layer/AtlasRestRetriever');
var PingPipelineFactory = require('factory/PingPipelineFactory');
var ids = require('atlas_access_layer/ids').getIds();

var startTime = Math.floor(new Date(2016, 03, 29, 22, 00).getTime()/1000);
var endTime = Math.floor(new Date(2016, 03, 30, 03, 00).getTime()/1000);

//set up connectors
//Mongodb
var dbConn = new DbConnection('PRODUCTION');
//Atlas (connects automatically)
var atlasretr = new AtlasConnection(startTime, endTime);

var filtered_pings = [];

/*
setTimeout(function(){
    console.log(filtered_pings.length);
}, 2*60*1000);

setTimeout(function(){
    console.log(filtered_pings.length);
}, 4*60*1000);

setTimeout(function(){
    console.log(filtered_pings.length);
}, 7*60*1000);
*/
//connect to db
dbConn.connect(function(db){

    //init the collections
    var pings = db.collection('comcastPings');
    //get psqlConnection connection
    var psqlConnection = new PsqlConnection();
    var ppFactory = new PingPipelineFactory(null,
        null, psqlConnection, null);
    var pingPipeline = ppFactory.createSingle();

    var ids_length = ids.length;
    var j = 0,
        w = 1,
        ping_ids = [];
    for(var i=0;i<ids_length;i++){
        if(i==j){
            ping_ids.push(ids[i]);
            j+=4;
        }
        if(i==w){
            ping_ids.push(ids[i]);
            w+=4;
        }
    }

    var limit = ping_ids.length;
        atlasretr.retrieve(2957510, function(measurements){
            if(measurements[0].type=='ping'){
                measurements.forEach(function(ping){
                    pingPipeline.execute(ping,
                        function(err, res){
                            if(err){
                                console.log(err);
                            }
                            else{
                                pings.insertOne(res);
                                //console.log(res);
                            }
                            //console.log(res);
                            //-------------
                        });
                });
            }
            //console.log(measurements[0]);
            console.log(measurements.length);
        });

        //set Atlas' event reciever




});

