var TracerouteParser = require('./TracerouteParser');
var PingParser = require('./PingParser');



var AtlasParser  = function() {
  this.tParser = new TracerouteParser();
  this.pParser = new PingParser();
}

AtlasParser.prototype.recieveMeasurement = function(measurement) {
  if(measurement.type == 'traceroute') {
    this.tParser.parse(measurement);
  }
  else if(measurement.type == 'ping'){
    this.pParser.parse(measurement);
  }
}

module.exports = AtlasParser;
