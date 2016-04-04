
var AtlasResultReciever = function(tracerouteManager, pingManager) {
  
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
