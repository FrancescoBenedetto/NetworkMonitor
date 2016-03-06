
var PingParser = function(){}

PingParser.prototype.parse = function(atlas_ping, callback) {
  var result = this.parseResult(atlas_ping.result);
  callback(atlas_ping.timestamp, atlas_ping.from, atlas_ping.dst_addr, result);
}

PingParser.prototype.parse = function(atlas_ping, callback) {
  var result = this.parseResult(atlas_ping.result);
  callback({id : atlas_traceroute.from.concat('_'+atlas_traceroute.dst_addr),
            timestamp : atlas_traceroute.endtime,
            src : atlas_traceroute.from,
            dst : atlas_traceroute.dst_addr,
            result : result
          }
        );
}


PingParser.prototype.parseResult = function(atlas_result) {
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

module.exports = PingParser;
