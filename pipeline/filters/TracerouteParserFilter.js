var MeasurementParserFilter = require('./MeasurementParserFilter');

var TracerouteParserFilter = function() {}

TracerouteParserFilter.prototype = Object.create(MeasurementParserFilter.prototype);

TracerouteParserFilter.prototype.parse = function(atlas_traceroute, callback) {
  var path = this.parsePath(atlas_traceroute.result);
    callback(atlas_traceroute.endtime, atlas_traceroute.from, atlas_traceroute.dst_addr, path);
}

TracerouteParserFilter.prototype.execute = function(atlas_traceroute, next) {
  var path = this.parsePath(atlas_traceroute.result);
  var af = this.getAddressFamily(atlas_traceroute.af, atlas_traceroute.mode, atlas_traceroute.from);
    next(null, {id : atlas_traceroute.from.concat('_'+atlas_traceroute.dst_addr),
              timestamp : atlas_traceroute.endtime,
              src : atlas_traceroute.from,
              dst : atlas_traceroute.dst_addr,
              path : path,
              af : af
            }
          );
}


TracerouteParserFilter.prototype.parsePath = function(atlas_path) {
  var path = [];
  var node, hopInfo;
  if(atlas_path==null) {
    return 'error';
  }
  else if(atlas_path.error!=null) {
    return atlas_path.error;
  }
  else {

    var limit = atlas_path.length;
    for(var i=0; i<limit; i++){

        hopInfo = atlas_path[i];
        if(hopInfo.error!=null) {
          path.push('error');
        }
        else {
          node = hopInfo.result[0];
          if(node.from!=null){
            path.push(node.from);
          }
          else if(node.x!=null) {
            path.push(node.x);
          }
        }

      }
  }
  return path;
}

module.exports = TracerouteParserFilter;
