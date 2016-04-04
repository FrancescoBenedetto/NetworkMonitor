var _ = require('underscore');
require('rootpath')();
var CompareFilter = require('pipeline/filters/CompareFilter');
var TracerouteUtils = require('model/Traceroute');
var TracerouteCouple = require('model/TracerouteCouple');


var CompareTracerouteFilter = function(mdao, cdao, serverSocket) {
  CompareFilter.call(this, mdao, cdao, serverSocket);
  this.couple = new TracerouteCouple();
}

CompareTracerouteFilter.prototype.executeLight = function(traceroutes, next){
  var nodesNumber, incoming, found, nodes, ips, couple;
  incoming = traceroutes.incoming;
  found = traceroutes.found;
  nodes = TracerouteUtils.getIndictedNodes(incoming.path, found.path);
  if(nodes!=null && nodes.length>0 && incoming.timestamp>found.timestamp) {
    //update most recent
    this.mdao.updateTimestampAndResultBy_id(found, incoming.timestamp, incoming.path);
    //insert the new couple
    couple = this.couple.buildTracerouteCouple(incoming, found);
    this.cdao.insert(couple);
    //send alert
    this.serverSocket.sendBroadcastAlert(incoming.timestamp);
    //send ips to next filter
    ips = _.filter(nodes, function(node) { return (/*node!='*' && */ node!='error'); });
    if(ips.length>1) { //filtra le coppie ip-error
      next(null, {af : incoming.af ,ips : ips});
    }
  }

  }


CompareTracerouteFilter.prototype.executeHeavy = function(traceroutes, next) {
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
      ips = _.filter(nodes, function(node) {
        return (node!='*' || node!='error');
      });
      if(ips.length>0) {
        next(null, ips);
      }
    }
  }
}

module.exports = CompareTracerouteFilter;
