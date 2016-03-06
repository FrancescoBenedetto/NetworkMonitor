var CompareFilter = require('./CompareFilter');
var TracerouteUtils = require('../model/Traceroute');
var _ = require('underscore');


var CompareFilterTraceroute = function(dao, serverSocket) {
  CompareFilter.call(this, dao, serverSocket);
}

CompareFilterTraceroute.prototype.execute = function(traceroutes, next) {
  var nodesNumber, t1, t2, nodes, ips, newer_timestamp;
  t1 = traceroutes.m1;
  t2 = traceroutes.m2;
  nodes = TracerouteUtils.getIndictedNodes(t1.path, t2.path);
  if(nodes!=null) {
    nodesNumber = nodes.length;
    if(nodesNumber==0) {
      if(t1.timestamp>t2.timestamp){
        this.dao.updateTimestamp(t2._id, t1.timestamp);
      }
    }
    else if(nodesNumber>0) {
      newer_timestamp = t2.timestamp;
      if(t1.timestamp>t2.timestamp){
        newer_timestamp = t1.timestamp;
        this.dao.updateTimestampAndResult(t2._id, t1.timestamp, t1.path);
        this.serverSocket.sendBroadcastAlert(newer_timestamp);
      }
      ips = _.filter(nodesNumber, function(node) {
        return node!='*' && node!='error';
      });
      if(ips>0) {
        next(ips);
      }
    }
  }
}
