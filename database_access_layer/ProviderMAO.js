var ip_converter = require('../utils/ip_converter');
var _ = require('underscore');


var ProviderMAO = function(collection){
  this.collection = collection;
}

ProviderMAO.prototype.findISPByIp = function(ip_address, callback) {
  var parsedIp = ip_converter.inet_aton(ip_address);
  this.collection.find({ 'ipstart' : {'$lt':parsedIp} , 'ipend':{'$gt':parsedIp} }, {'provider' : 1}).limit(1).next(function(err, res){
    if(err)
      throw err;
    else {
      if(res!=null)
        callback(res.provider);
    }
  });
}



module.exports = ProviderMAO;
