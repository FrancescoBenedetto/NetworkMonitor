

var MeasurementMAO = function(collection) {
  this.collection = collection;
}

MeasurementMAO.prototype.findById = function(measurement, callback) {
  this.collection.find({ 'id' : measurement.id }).limit(1).next(function(err, res){
    if(err) {
       throw err;
    }
    else {
      callback(res);
    }
  })
}

MeasurementMAO.prototype.findBy_id = function(measurement, callback) {
  this.collection.find({ 'id' : measurement._id }).limit(1).next(function(err, res){
    if(err) {
       throw err;
    }
    else {
      callback(res);
    }
  })
}

MeasurementMAO.prototype.upsertJson = function(json, callback) {
  this.collection.updateOne({'id': json.id}, json, {'upsert': true }, callback);
}

MeasurementMAO.prototype.insertJson = function(json) {
  this.collection.insert(json, function(err, res){
    if(err){
      throw err;
    }
  });
}

MeasurementMAO.prototype.updateTimestampBy_id = function(measurement, timestamp){
  this.collection.update({'_id': measurement._id}, { $set : {'timestamp' : timestamp}}, function(err, res){
    if(err) {
      throw err;
    }
  });
}

MeasurementMAO.prototype.updateTimestampById = function(measurement, timestamp){
  this.collection.update({'id':measurement.id}, { $set : {'timestamp' : timestamp}}, function(err, res){
    if(err) {
      throw err;
    }
  });
}



module.exports = MeasurementMAO;
