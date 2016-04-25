require('rootpath')();
var CompareFilter = require('pipeline/filters/CompareFilter');
var PingUtils = require('model/Ping');
var PingCouple = require('model/PingCouple');


var ComparePingFilter = function(mdao, cdao, serverSocket) {
  CompareFilter.call(this, mdao, cdao, serverSocket);
  this.coupleUtils = new PingCouple();
}


ComparePingFilter.prototype.executeError = function(pings, next){
  var incoming = pings.incoming,
      found = pings.found;

    if(incoming.timestamp > found.timestamp){
        if(PingUtils.oneErrored(found.result, incoming.result)){
            if(found.result != 'error' || incoming.result != 'error'){ //update db just if result is different (one error, one not)
                //update ping
                this.mdao.updateTimestampAndResultBy_id(found, incoming.timestamp, incoming.result);
                //insert couple
                //this.cdao.insert(this.coupleUtils.buildPingCouple(incoming, found));
                //alert client
                //this.serverSocket.sendBroadcastAlert(incoming.timestamp);
            }
            next(null, pings);
        }
    }
}

ComparePingFilter.prototype.executeOnChanges = function(pings, next){
  var incoming = pings.incoming
      , found = pings.found;
  if(incoming.timestamp>found.timestamp) {
    if(PingUtils.hasChanged(found.result, incoming.result)){
      //update ping
      this.mdao.updateTimestampAndResultBy_id(found, incoming.timestamp, incoming.result);
      //insert couple
      this.cdao.insert(this.coupleUtils.buildPingCouple(incoming, found));
      //alert client
      this.serverSocket.sendBroadcastAlert(incoming.timestamp);
      //send result to next filter
      next(null, {af:incoming.af, ips : [incoming.src, incoming.dst]});
    }
  }
  
}

ComparePingFilter.prototype.executeLight = function(pings, next) {
  var incoming, found, nowUnreachable;
  incoming = pings.incoming;
  found = pings.found;
  if(incoming.timestamp>found.timestamp){
    if(incoming.result=='error' && found.result!='error'){
      //update ping
      this.mdao.updateTimestampAndResultBy_id(found, incoming.timestamp, incoming.result);
      //insert couple
      this.cdao.insert(this.coupleUtils.buildPingCouple(incoming, found));
      //alert client
      this.serverSocket.sendBroadcastAlert(incoming.timestamp);
    }
    else if(incoming.result!='error' && found.result=='error'){
      //update timestamp and result
      this.mdao.updateTimestampAndResultBy_id(found, incoming.timestamp, incoming.result);
    }
  }
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
