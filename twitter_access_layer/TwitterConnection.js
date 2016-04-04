var Twit = require('twit');
var config = require('../config').twitterConfig();

var TwitterConnection = function(){
  this.connection = new Twit(
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret
  );
  this.stream = this.connection.stream('statuses/filter', {'track' : config.tracked_words });
}

TwitterConnection.prototype.setReciever = function(reciever) {
  this.stream.on('twit', function(twit){
    reciever(twit);
  });
}

module.exports = TwitterConnection;
