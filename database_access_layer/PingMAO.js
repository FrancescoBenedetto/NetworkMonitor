var MeasurementMAO = require('./MeasurementMAO')


var PingMAO = function(collection) {
  MeasurementMAO.call(this, collection);
}

PingMAO.prototype = Object.create(MeasurementMAO.prototype);

Ping.prototype.updateTimestampAndResult = function(_id, timestamp, result) {
  this.collection.update({'_id':_id}, {'timestamp' : timestamp, 'result' : result} ,function(err, result){
    if(err) {
      throw err;
    }
  })
}

module.exports = PingMAO;
