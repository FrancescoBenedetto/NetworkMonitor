var Measurement = require('./Measurement');

var Traceroute = function(timestamp, src, dst, path) {
  Measurement.call(this, timestamp, src, dst);
  this.path = path;
}

Traceroute.prototype = Object.create(Measurement.prototype);

Traceroute.prototype.equalPaths = function(toComparePath) {
  var pathLength = this.path.length;
  if(pathLength!=toComparePath.length){
    return false;
  }
  else {
    for(var i=0; i<pathLength; i++) {
      if(this.path[i]!=toComparePath[i]){
        return false;
      }
    }
    return true;
  }
}

Traceroute.getIndictedNodes = function(path1, path2) {
  var shorterPath, indictedNodes, node1, node2;
  indictedNodes = [];
  //pre-check
  if(path1=='error' || path2=='error') {
    return null;
  }
  //init the shorter path
  shorterPath = path2.length;
  if(path1.length<path2.length) {
    shorterPath = path1.length;
  }
  //iterate over arrays looking for the differing nodes
  for(var i=0; i<shorterPath; i++) {
    node1 = path1[i]; node2 = path2[i];
    if(node1!=node2) {
      indictedNodes.push(node1);
      indictedNodes.push(node2);
    }
  }

  return indictedNodes;

}

Traceroute.prototype.getJson = function() {
  return { id : this.id, timestamp : this.timestamp, src : this.src, dst : this.dst, path : this.path}
}


module.exports = Traceroute;
