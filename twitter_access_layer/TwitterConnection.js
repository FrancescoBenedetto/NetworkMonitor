var Twit = require('twit');
var config = require('../config').twitterConfig();

var TwitterConnection = function(){
  this.connection = new Twit(
      {
        consumer_key: config.consumer_key,
        consumer_secret: config.consumer_secret,
        access_token: config.access_token,
        access_token_secret: config.access_token_secret
      }
  );
  this.stream = null;
  this.consecutiveErrors = 0;
}

TwitterConnection.prototype.setTrackwords = function(trackwords){
  this.stream = this.connection.stream('statuses/filter', { track : trackwords });
  this.setAlertEvents();
};

TwitterConnection.prototype.setReciever = function(reciever) {
  this.stream.on('tweet', function(twit){
      reciever(twit);
  });
};

TwitterConnection.prototype.closeConnection = function(){
    if(this.stream!=null){
        this.stream.stop();
    }
    else{
        console.log('STREAM IS NULL');
    }
};

TwitterConnection.prototype.reconnect = function(trackwords){
  this.closeConnection();
  this.setTrackwords(trackwords);
};

TwitterConnection.prototype.onconnect = function(){
    this.stream.on('connected', function(response){
       // console.log(response);
        console.log('CONNECTED');
    });
}

TwitterConnection.prototype.ondisconnect = function(){
    this.stream.on('disconnect', function(reason){
        console.log('DISCONNECT');
        console.log(reason);
    });
};

TwitterConnection.prototype.onerror = function(){
    var self = this;
    var timeout;
    this.stream.on('error',function(error){
        console.log('ERROR');
        console.log(error);
        if(error.statusCode==420){
            self.consecutiveErrors += 1;
            timeout = Math.pow(2, consecutiveErrors)*60*1000;
            self.closeConnection();
           /* setTimeout(function(){
                self.stream.start();
            }, timeout)*/
        }
    });
};

TwitterConnection.prototype.setAlertEvents = function(){
    this.onconnect();
    this.ondisconnect();
    this.onerror();
};

/*
var connection = new TwitterConnection();
connection.setTrackwords(['awesome', 'good', 'spanishGp', '#GiornataDellaTerra']);
connection.setReciever(console.log);
*/
module.exports = TwitterConnection;
