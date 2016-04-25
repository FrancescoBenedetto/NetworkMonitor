var Measurement = require('./Measurement');

var Ping = function(timestamp, src, dst, result) {
  Ping.call(this, timestamp, src, dst);
  this.result = result;
}

Ping.prototype = Object.create(Measurement.prototype);

Ping.prototype.equalResults = function(toCompareResult) {
  return this.result == toCompareResult;
}

Ping.nowUnreachable = function(r1, r2) {
  return r1!='error' && r2=='error'
}

Ping.nowReachable = function(r1, r2){
  if(r1=='error' && r2!='error'){
    return true;
  } 
  else {
    return false;
  }
}

Ping.hasChanged = function(r1, r2) {
  if(this.nowUnreachable(r1,r2) || this.nowReachable(r1, r2)){
    return true;
  }
  else {
    return false;
  }
}

Ping.oneErrored = function(r1, r2){
  return r1=='error' || r2=='error';
  }

    
module.exports = Ping;
