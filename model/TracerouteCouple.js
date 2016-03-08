MeasurementCouple = require('./MeasurementCouple');

var TracerouteCouple = function(){
  MeasurementCouple.call(this);
}

TracerouteCouple.prototype = Object.create(MeasurementCouple.prototype);

TracerouteCouple.prototype.buildTracerouteCouple = function(m1, m2) {
  var couple = this.build(m1, m2);
  if(couple!=null) {
    couple.newer_path = m1.path;
    couple.older_path = m2.path;
  }
  return couple;
}

module.exports = TracerouteCouple;
