require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var PsqlConnection = require('database_access_layer/PostgresqlDbConnection');
var AtlasConnection = require('atlas_access_layer/AtlasConnection');
var ClientConnection = require('server_socket_layer/ClientConnection');
var TwitterConnection = require('twitter_access_layer/TwitterConnection');
var TraceroutePipelineFactory = require('factory/TraceroutePipelineFactory');
var PingPipelineFactory = require('factory/PingPipelineFactory');




//set up connectors
//Mongodb
var dbConn = new DbConnection('PRODUCTION');
//Atlas (connects automatically)
var atlasConn = new AtlasConnection();
//Twitter
//var twitter = new TwitterConnection();
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

    serverSocket.io.on('connect', function(socket){
        socket.emit('times', {min: pingPipeline.pingTracker.min_time, max : pingPipeline.pingTracker.max_time});
    });

  //set Atlas' event reciever

  atlasConn.setEventReciever(function(measurement){
    if(measurement.type=='traceroute'){
        /*
    traceroutePipeline.execute(measurement,
         function(err, res){
           if(err){
             throw err;
           }
             analyzer.execute(res);
      });*/

    }
    else if(measurement.type=='ping'){
      pingPipeline.execute(measurement,
      function(err, res){
          if(err){
              throw err;
          }
          //console.log(res);
          //-------------
      });
    }

  });

    var twitter_text = require('twitter-text');
/*
    var tweets = [];
    var t_n = 0;
    var tweetReciever = function(tweet) {
       // console.log(tweet);
        //db.collection('tweets').insertOne(tweet);
        tweet.text = twitter_text.autoLink(tweet.text, { usernameIncludeSymbol: true }, tweet.entities);

       if(t_n==50){
          // tweets.pop();
           //tweets.unshift(tweet);
           t_n = 0;
           serverSocket.sendBroadcastTweets(tweets);
         //  tweets= [];
       }
       else {
           tweets.unshift(tweet);
           serverSocket.sendBroadcastTweets(tweets); //for test
           t_n++;
       }
    };

    setInterval(function(){
        if(pingPipeline.providerTracker.trackingProviders.length>0){
            var trckwords = pingPipeline.providerTracker.prepareWordsToStream();
            console.log(trckwords);
            twitter.reconnect(trckwords);
            twitter.setReciever(tweetReciever);
        }
    }, Math.pow(2, twitter.consecutiveErrors) * 10 * 60 * 1000);
*/


    setTimeout(function(){
        atlasConn.unsubscribeToChannels();
        twitter.closeConnection();
        console.log('time ended');
    }, 60*60*1000);

   // process.on('SIGINT', function(){ atlasConn.unsubscribeToChannels()});
});
