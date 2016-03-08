var socket_client = require("socket.io-client");
var ids = require('./ids.js').getIds();

var AtlasConnection = function() {
  this.socket = socket_client("http://atlas-stream.ripe.net:80", { path : "/stream/socket.io"});
  this.setEvents();
}

AtlasConnection.prototype.getConnection = function() {
  return this.socket;
}

AtlasConnection.prototype.subscribeToChannels() {
  ids.forEach(function(id){
    this.socket.emit('atlas_subscribe', { stream_type: "result", msm: id })
  });
}

AtlasConnection.prototype.unsubscribeToChannels() {
  ids.forEach(function(id){
    this.socket.emit('atlas_unsubscribe', { stream_type: "result", msm: id })
  })
}

AtlasConnection.prototype.setEventReciever = function(reciever) {
  this.socket.on('atlas_result', function(result) {
    reciever(result);
  });

}

AtlasConnection.prototype.setEvents = function() {

  this.socket.on('connect', function(){
    console.log('connected at '+ new Date(Date.now())+ '');
    this.subscribeToChannels();
  })

  this.socket.on('atlas_error', function(error){
    console.log(error);
  });

  this.socket.on('disconnect', function(){
    console.log('disconnected at '+ new Date(Date.now())+ '');
  });

  this.socket.on('error', function(error){
    console.log(error);
  });
}

module.exports = AtlasConnection;
