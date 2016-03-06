

var MeasurementMAO = function(collection) {
  this.collection = collection;
}

MeasurementMAO.prototype.findById = function(Measurement, callback) {
  this.collection.find({ 'id' : Measurement.id }).limit(1).next(function(err, res){
    if(err) {
       throw err;
    }
    else {
      callback(res);
    }
  })
}

MeasurementMAO.prototype.upsertJson = function(json) {
  this.collection.updateOne({'id': json.id}, json, {'upsert': true }, function(err){
     if(err)
       callback(err);
   });
}

MeasurementMAO.prototype.insertJson = function(json) {
  this.collection.insert(json, function(res, err){
    if(err)
      throw err;
  })
}

MeasurementMAO.prototype.updateTimestamp = function(_id, timestamp){
  this.collection.update({'_id':_id}, {'timestamp' : timestamp}, function(err, res){
    if(err) {
      throw err;
    }
  });
}



module.exports = MeasurementMAO;
