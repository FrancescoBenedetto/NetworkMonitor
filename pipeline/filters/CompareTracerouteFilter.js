var _ = require('underscore');
require('rootpath')();
var CompareFilter = require('pipeline/filters/CompareFilter');
var TracerouteUtils = require('model/Traceroute');
var TracerouteCouple = require('model/TracerouteCouple');


var CompareTracerouteFilter = function(mdao, cdao, serverSocket) {
  CompareFilter.call(this, mdao, cdao, serverSocket);
  this.couple = new TracerouteCouple();
}

CompareTracerouteFilter.prototype.execute = function(traceroutes, next) {
  var nodesNumber, incoming, found, nodes, ips, newer_timestamp;
  incoming = traceroutes.incoming;
  found = traceroutes.found;
  nodes = TracerouteUtils.getIndictedNodes(incoming.path, found.path);
  if(nodes!=null) {
    nodesNumber = nodes.length;
    if(nodesNumber==0) {
      if(incoming.timestamp>found.timestamp){
        this.mdao.updateTimestampBy_id(found, incoming.timestamp);
      }
    }
    else if(nodesNumber>0) {
      newer_timestamp = found.timestamp;
      if(incoming.timestamp>found.timestamp){
        newer_timestamp = incoming.timestamp;
        this.mdao.updateTimestampAndResultBy_id(found, incoming.timestamp, incoming.path);
        this.cdao.insert(this.couple.buildTracerouteCouple(incoming, found));
        this.serverSocket.sendBroadcastAlert(newer_timestamp);
      }
      else {
        this.cdao.insert(this.couple.buildTracerouteCouple(found, incoming));
        this.serverSocket.sendBroadcastAlert(incoming.timestamp);
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

module.exports = CompareTracerouteFilter;
