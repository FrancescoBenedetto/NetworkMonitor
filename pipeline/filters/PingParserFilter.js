var _ = require('underscore');
var MeasurementParserFilter = require('./MeasurementParserFilter');

var PingParserFilter = function(){}

PingParserFilter.prototype.parse = function(atlas_ping, callback) {
  var result = this.parseResult(atlas_ping.result);
  callback(atlas_ping.timestamp, atlas_ping.from, atlas_ping.dst_addr, result);
}

PingParserFilter.prototype = Object.create(MeasurementParserFilter.prototype);

PingParserFilter.prototype.execute = function(atlas_ping, next) {
  var result = this.parseWholeResult(atlas_ping.result);
  var af = this.getAddressFamily(atlas_ping.af, atlas_ping.mode, atlas_ping.from);
  next(null, {id : atlas_ping.from.concat('_'+atlas_ping.dst_addr),
            timestamp : atlas_ping.timestamp,
            src : atlas_ping.from,
            dst : atlas_ping.dst_addr,
            result : result,
            af : af
          }
        );
}


PingParserFilter.prototype.parseResult = function(atlas_result) {
  var res = atlas_result[0];
  if(res.rtt != null){
    return res.rtt;
  }
  else if(res.x!=null) {
    return res.x;
  }
  else {
    return 'error';
  }
}

PingParserFilter.prototype.parseWholeResult = function(atlas_result){
    var rtt= _.find(atlas_result, function(el){return el.rtt!=null;});
    var error = _.find(atlas_result, function(el){return el.error!=null})!=undefined;
    if(atlas_result[0].error!=null){
        return 'error';
    }
    else if(rtt!=undefined){
        return rtt.rtt;
    }
    else {
        return '*';
    }
}

module.exports = PingParserFilter;
