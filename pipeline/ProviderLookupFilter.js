var Db_ClientFilter = require('./Db_ClientAccessFilter');

var ProviderLookUpFilter = function(pdao, serverSocket) {
  Db_ClientFilter.call(this, pdao, serverSocket);
}

ProviderLookUpFilter.prototype.execute = function(ips, next) {
  ips.forEach(function(ip){
    this.dao.findByIp(ip, function(res){
      if(res!=null) {
        this.serverSocket.sendBroadcastProvider(res);
        next(res);
      }
    });
  })
}
