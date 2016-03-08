var MeasurementMAO = require('./MeasurementMAO')


var TracerouteMAO = function(collection) {
  MeasurementMAO.call(this, collection);
}

TracerouteMAO.prototype = Object.create(MeasurementMAO.prototype);

TracerouteMAO.prototype.updateTimestampAndResultBy_id = function(measurement, timestamp, path) {
  this.collection.update({'_id': measurement._id}, { $set : {'timestamp' : timestamp, 'path' : path}} ,function(err, result){
    if(err) {
      throw err;
    }
  })
}

TracerouteMAO.prototype.updateTimestampAndResultById = function(measurement, timestamp, path) {
  this.collection.update({'id': measurement.id}, { $set : {'timestamp' : timestamp, 'path' : path}} ,function(err, result){
    if(err) {
      throw err;
    }
  })
}

module.exports = TracerouteMAO;
