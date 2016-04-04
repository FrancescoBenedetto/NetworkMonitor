require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var PsqlConnection = require('database_access_layer/PostgresqlDbConnection');
var AtlasConnection = require('atlas_access_layer/AtlasConnection');
var ClientConnection = require('server_socket_layer/ClientConnection');
var TraceroutePipelineFactory = require('factory/TraceroutePipelineFactory');
var PingPipelineFactory = require('factory/PingPipelineFactory');
//--------------
var PingProviderAnalysisFilter = require('pipeline/filters/PingProviderAnalysisFilter');

//--------------



//set up connectors
//Mongodb
var dbConn = new DbConnection('PRODUCTION');
//Atlas (connects automatically)
var atlasConn = new AtlasConnection();
//clients
var serverSocket = new ClientConnection();

//turn server in listening mode for socket
serverSocket.listen();

//connect to db
dbConn.connect(function(db){

  //init the collections
  var collections = dbConn.setCollections(db);
  //get psqlConnection connection
  var psqlConnection = new PsqlConnection();
  //init traceroute pipelines
  var traceroute_collections = collections.traceroute;
  var tpFactory = new TraceroutePipelineFactory(traceroute_collections.most_recent_measurement,
                                      traceroute_collections.couples, psqlConnection, serverSocket);
  var traceroutePipeline = tpFactory.create();
  //init ping pipeline
  var ping_collections = collections.ping;
  var ppFactory = new PingPipelineFactory(ping_collections.most_recent_measurement,
                                      ping_collections.couples, psqlConnection, serverSocket);
  var pingPipeline = ppFactory.create();

  //-----------
  var analysisColl = db.collection('pingProviderAnalysis');
  var analyzer = new PingProviderAnalysisFilter(analysisColl, null);


  //set Atlas' event reciever
  atlasConn.setEventReciever(function(measurement){
    if(measurement.type=='traceroute'){
      
     /* traceroutePipeline.execute(measurement,
         function(err, res){
           if(err){
             throw err;
           }
      });*/
    }
    else if(measurement.type=='ping'){
      pingPipeline.execute(measurement,
      function(err, res){
          if(err){
              throw err;
          }
          //-------------
          analyzer.execute(res);
      });
    }
  });


  setTimeout(function(){
    atlasConn.unsubscribeToChannels();
    if(analyzer.total.array.length>0){
      analysisColl.insertMany(analyzer.total.array);
    }
    console.log('20 minutes passed');
  }, 20*60000);
})
