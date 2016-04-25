
var FakeServerSocket = function(){
  this.alert = false;
};

FakeServerSocket.prototype.getStatus = function(){
  return this.alert;
};

FakeServerSocket.prototype.sendBroadcastAlert = function(timestamp) {
  this.alert = true;
};

FakeServerSocket.prototype.sendBroadcastProvider = function(provider){
  this.alert = true;
};

FakeServerSocket.prototype.reset = function() {
  this.alert = false;
};

FakeServerSocket.prototype.sendBroadcastErrors = function(errors){
  this.alert = true;
}

module.exports = FakeServerSocket;
