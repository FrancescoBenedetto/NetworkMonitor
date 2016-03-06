var CompareFilter = require('./CompareFilter');
var PingUtils = require('../model/Ping');


var CompareFilterPing = function(dao, serverSocket) {
  CompareFilter.call(this, dao, serverSocket);
}


CompareFilterPing.prototype.execute = function(pings, next) {
  var p1, p2, nowUnreachable;
  p1 = pings.m1;
  p2 = pings.m2;
  if(p1.timestamp>p2.timestamp) {
    if(p1.result!=p2.result) {
      this.dao.updateTimestampAndResult(p2._id, p1.timestamp, p1.result);
      nowUnreachable = PingUtils.nowUnreachable(p1, p2);
      if(nowUnreachable) {
        this.serverSocket.sendBroadcastAlert(p1.timestamp);
      }
    }
    else {
      this.dao.updateTimestamp(p2._id, p1.timestamp);
    }

  }
}

module.exports = CompareFilterPing
