var server = require('http').createServer();
var serverConfig = require('../config').serverConfig();
var socketEvents = require('../config').socketConfig();

var ClientConnection = function() {
  this.io = require('socket.io')(server);
  //this.io.on('connect', this.setEvents(socket));
}

ClientConnection.prototype.listen = function() {
  server.listen(serverConfig.port, function(){
    console.log('listening on port '+ serverConfig.port.toString());
  });
}

ClientConnection.prototype.setEvents = function(socket) {
  //do stuff
}

ClientConnection.prototype.sendBroadcastAlert = function(timestamp) {
  this.io.emit(socketEvents.alert, timestamp);
}

ClientConnection.prototype.sendBroadcastProvider = function(provider, timestamp) {
  this.io.emit(socketEvents.provider, {provider : provider, timestamp : timestamp});
}

module.exports = ClientConnection;
