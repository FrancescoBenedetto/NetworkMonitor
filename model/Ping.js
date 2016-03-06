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
  if(r1.result!=error && r2.result=='error') {
    return true;
  }
}
module.exports = Measurement;
