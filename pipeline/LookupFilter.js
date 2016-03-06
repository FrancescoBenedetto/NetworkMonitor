var MeasurementMAO = require('../database_access_layer/MeasurementMAO');

var Lookup = function(mmao) {
  this.mmao = mmao;
}

Lookup.prototype.execute = function(measurement, next) {
  this.mmao.findById(measurement, function(res){
    if(res==null) {
      this.mmao.insertJson(measurement);
    }
    else {
      next({ m1 : measurement, m2 : res});
    }
  });
}
