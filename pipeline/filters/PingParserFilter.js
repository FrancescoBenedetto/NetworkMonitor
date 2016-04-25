var _ = require('underscore');
var MeasurementParserFilter = require('./MeasurementParserFilter');

var PingParserFilter = function(){
}

PingParserFilter.prototype.parse = function(atlas_ping, callback) {
  var result = this.parseResult(atlas_ping.result);
    
  callback(atlas_ping.timestamp, atlas_ping.from, atlas_ping.dst_addr, result);
}

PingParserFilter.prototype = Object.create(MeasurementParserFilter.prototype);

PingParserFilter.prototype.execute = function(atlas_ping, next) {
  var result = this.parseWholeResult(atlas_ping.result);
  var af = this.getAddressFamily(atlas_ping.af, atlas_ping.mode, atlas_ping.from);
  var timestamp = this.parseTimestamp(atlas_ping.timestamp);
  var dst = this.parseDstAddr(atlas_ping.addr, atlas_ping.dst_addr);
  var src = this.parseSrc(atlas_ping);
    if(result != 'error') {
        next(null, {id : atlas_ping.from.concat('_'+dst),
                timestamp : timestamp,
                src : atlas_ping.from,
                dst : dst,
                result : result,
                af : af,
                prb_id : atlas_ping.prb_id
            }
        );
    }
    else {
        next(null, {id : atlas_ping.from.concat('_'+dst),
                timestamp : timestamp,
                src : src,
                dst : dst,
                result : result,
                result_type : atlas_ping.result[0].error,
                af : af,
                prb_id : atlas_ping.prb_id
            }
        );
    }
}

PingParserFilter.prototype.parseSrc = function(atlas_ping) {
    if(atlas_ping.from != ''){
        return atlas_ping.from;
    }
    else if(atlas_ping.src_addr != null) {
        return atlas_ping.src_addr;
    }
    else {
        return '';
    }
}

PingParserFilter.prototype.parseTimestamp = function(timestamp){
    if(timestamp!=null){
        return timestamp;
    }
    else {
        return Math.floor(Date.now()/1000);
    }
}
PingParserFilter.prototype.parseDstAddr = function(ping, addr, dst_addr){
    if(addr!=null){
        return addr;
    }
    else {
        return dst_addr;
    }
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
