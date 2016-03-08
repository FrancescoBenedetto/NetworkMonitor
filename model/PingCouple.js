MeasurementCouple = require('./MeasurementCouple');

var PingCouple = function(){
  MeasurementCouple.call(this);
}

PingCouple.prototype = Object.create(MeasurementCouple.prototype);

PingCouple.prototype.buildPingCouple = function(m1, m2) {
  var couple = this.build(m1, m2);
  if(couple!=null) {
    couple.newer_result = m1.result;
    couple.older_result = m2.result;
  }
  return couple;
}

module.exports = PingCouple;
