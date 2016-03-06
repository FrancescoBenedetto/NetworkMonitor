var MeasurementMAO = require('./MeasurementMAO')


var TracerouteMAO = function(collection) {
  MeasurementMAO.call(this, collection);
}

TracerouteMAO.prototype = Object.create(MeasurementMAO.prototype);

Traceroute.prototype.updateTimestampAndResult = function(_id, timestamp, path) {
  this.collection.update({'_id':_id}, {'timestamp' : timestamp, 'path' : path} ,function(err, result){
    if(err) {
      throw err;
    }
  })
}

module.exports = TracerouteMAO;
