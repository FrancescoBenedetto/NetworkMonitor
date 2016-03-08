var MeasurementMAO = require('./MeasurementMAO')


var PingMAO = function(collection) {
  MeasurementMAO.call(this, collection);
}

PingMAO.prototype = Object.create(MeasurementMAO.prototype);

PingMAO.prototype.updateTimestampAndResultBy_id = function(measurement, timestamp, result) {
  this.collection.update({'_id': measurement._id}, { $set : {'timestamp' : timestamp, 'result' : result}} ,function(err, result){
    if(err) {
      throw err;
    }
  })
}

PingMAO.prototype.updateTimestampAndResultById = function(measurement, timestamp, result) {
  this.collection.update({'id': measurement.id}, { $set : {'timestamp' : timestamp, 'result' : result}} ,function(err, result){
    if(err) {
      throw err;
    }
  })
}

module.exports = PingMAO;
