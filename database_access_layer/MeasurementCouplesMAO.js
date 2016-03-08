
var MeasurementCouplesMAO = function(collection) {
  this.collection = collection;
  this.buffer = [];
  this.bufferCounter = 0;
  this.BUFFER_LIMIT = 200;
}



MeasurementCouplesMAO.prototype.insert = function(couple) {
  this.collection.insert(couple, function(err, res){
    if(err){
      throw err;
    }
  });
}


MeasurementCouplesMAO.prototype.insertMany = function(couple){
  if(this.bufferCounter==this.BUFFER_LIMIT) {
    this.collection.insertMany(this.buffer, function(err, res){
      if(err)
        throw err;
    })
  }
  else {
    this.buffer.push(couple);
  }
}

MeasurementCouplesMAO.prototype.findOneById = function(couple, callback) {
  this.collection.find({ 'id' : couple.id }).limit(1).next(function(err, res){
    if(err) {
       throw err;
    }
    else {
      callback(res);
    }
  })
}

MeasurementCouplesMAO.prototype.findAllById = function(id, callack){

}

MeasurementCouplesMAO.prototype.findAllInInterval = function(interval, callback) {

}

MeasurementCouplesMAO.prototype.findAllInIntervalById = function(interval, id, callback){}


module.exports = MeasurementCouplesMAO;
