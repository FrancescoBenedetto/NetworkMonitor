var Db_ClientFilter = require('./Db_ClientAccessFilter');

var ProviderLookUpFilter = function(dao, serverSocket) {
  Db_ClientFilter.call(this, dao, serverSocket);
}

ProviderLookUpFilter.prototype.execute = function(ips, next) {
  var self = this;
  if(ips.length==0 || ips==null) {
    return;
  }
  ips.forEach(function(ip){
    self.dao.findByIp(ip, function(res){
      if(res!=null && res!='Unknown') {
        self.serverSocket.sendBroadcastProvider(res);
        next(res);
      }
      else {
        return;
      }
    });
  });
}

module.exports = ProviderLookUpFilter;
