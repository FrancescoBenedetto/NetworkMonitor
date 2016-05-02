var socket_client = require("socket.io-client");
var ids = require('./ids.js').getIds();

var AtlasConnection = function() {
  this.socket = socket_client("http://atlas-stream.ripe.net:80", { path : "/stream/socket.io"});
  this.setEvents();
    //this.setHistoricalEvents();
}

AtlasConnection.prototype.getConnection = function() {
  return this.socket;
}

//probe events
AtlasConnection.prototype.subscribe_to_prb = function(prb_id, start_time) {
  this.socket.emit('atlas_subscribe', {
    stream_type : 'probestatus',
    //startTime : start_time,
    prb : prb_id
  });
};

AtlasConnection.prototype.unsubscribe_to_prb = function(prb_id) {
  this.socket.emit('atlas_unsubscribe', {
    stream_type : 'probestatus',
    prb : prb_id
  });
};

AtlasConnection.prototype.setProbeStatusReciever = function(reciever) {
    this.socket.on('atlas_probestatus', function(status){
        reciever(status);
    });
};

AtlasConnection.prototype.subscribeToHistoricalChannel = function(startTime, endTime) {
  var self = this;
  ids.forEach(function(id){
    self.socket.emit('atlas_subscribe', {
      stream_type: 'result',
      msm : id,
      startTime : startTime,
      endTime : endTime
    })
  })
}

//measurements events
AtlasConnection.prototype.subscribeToChannels = function() {
  var self = this;
  ids.forEach(function(id){
    self.socket.emit('atlas_subscribe', { stream_type: "result", msm: id });
  });
};

AtlasConnection.prototype.unsubscribeToChannels = function() {
  var self = this;
  ids.forEach(function(id){
    self.socket.emit('atlas_unsubscribe', { stream_type: "result", msm: id });
  })
}

AtlasConnection.prototype.setEventReciever = function(reciever) {
  this.socket.on('atlas_result', function(result) {
    reciever(result);
  });

}

AtlasConnection.prototype.setEvents = function() {
  var self = this;
  this.socket.on('connect', function(){
    console.log('connected at '+ new Date(Date.now())+ '');
    self.subscribeToChannels();
  })

  this.socket.on('atlas_error', function(error){
    console.log('Atlas Error: '+error);
  });

  this.socket.on('disconnect', function(){
    console.log('disconnected at '+ new Date(Date.now())+ '');
  });

  this.socket.on('error', function(error){
    console.log('Socket Error: '+error);
  });
};


AtlasConnection.prototype.setHistoricalEvents = function(){
  var self = this;
    var startTime = Math.floor(new Date(2016, 03, 29).getTime()/1000);
    var endTime = Math.floor(new Date(2016, 03, 29, 01, 00).getTime()/1000);
  this.socket.on('connect', function(){
    console.log('connected at '+ new Date(Date.now())+ '');
    self.subscribeToHistoricalChannel(startTime, endTime);
  })

  this.socket.on('atlas_error', function(error){
    console.log('Atlas Error: '+error);
  });

  this.socket.on('disconnect', function(){
    console.log('disconnected at '+ new Date(Date.now())+ '');
  });

  this.socket.on('error', function(error){
    console.log('Socket Error: '+error);
  });
};


module.exports = AtlasConnection;
