require('rootpath')();
var CompareFilter = require('pipeline/filters/CompareFilter');
var PingUtils = require('model/Ping');
var PingCouple = require('model/PingCouple');


var ComparePingFilter = function(mdao, cdao, serverSocket) {
  CompareFilter.call(this, mdao, cdao, serverSocket);
  this.coupleUtils = new PingCouple();
}


ComparePingFilter.prototype.execute = function(pings, next) {
  var incoming, found, nowUnreachable;
  incoming = pings.incoming;
  found = pings.found;
  if(incoming.timestamp>found.timestamp) {
    if(incoming.result!=found.result) {
      this.mdao.updateTimestampAndResultBy_id(found, incoming.timestamp, incoming.result);
      nowUnreachable = PingUtils.nowUnreachable(found.result, incoming.result);
      if(nowUnreachable) {
        this.serverSocket.sendBroadcastAlert(incoming.timestamp);
        this.cdao.insert(this.coupleUtils.buildPingCouple(incoming, found));
      }
    }
    else {
      this.mdao.updateTimestampBy_id(found, incoming.timestamp);
    }

  }
}


module.exports = ComparePingFilter;
