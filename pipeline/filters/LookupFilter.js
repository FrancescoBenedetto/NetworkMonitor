
var Lookup = function(dao) {
  this.dao = dao;
}

Lookup.prototype.execute = function(measurement, next) {
  var self = this;
  this.dao.findById(measurement, function(res){
    if(res==null) {
      self.dao.insertJson(measurement);
    }
    else {
      next(null, { incoming : measurement, found : res});
    }
  });
}

module.exports = Lookup;
