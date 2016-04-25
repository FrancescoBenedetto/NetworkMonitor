var Db_ClientFilter = require('./Db_ClientAccessFilter');
var _ = require('underscore');

var ProviderLookUpFilter = function(dao, serverSocket) {
  Db_ClientFilter.call(this, dao, serverSocket);
  this.buffer = [];
  this.counter = 0;
  this.MAX_BUFFER_SIZE = 50;
}


ProviderLookUpFilter.prototype.execute = function(af2ips, next) {
  var ips, self;
  var af = af2ips.af;
  var ips = af2ips.ips;
  if(af==4 && ips.length>0) {
    var self = this;
    ips.forEach(function(ip){
      self.dao.findISPbyIpv4(ip, function(res){
        if(res!=null && res!='Unknown'){
          next(null, res);
        }
      })
    })
  }
}

ProviderLookUpFilter.prototype.executeCouplePing = function(af2ips, next){
  var ips, self, af;
  af = af2ips.af;
  ips = af2ips.ips;
  if(ips.length>1){
    ips  = _.filter(ips, function(ip){return ip!='*' && ip!='' && ip!=null });
    if(af==4){
      this.coupleHelper(ips, this.dao.findISPbyIpv4, this.dao.findCoupleISPbyIpv4, function(res){
        next(null, res);
      });
    }
    else {
      this.coupleHelper(ips, this.dao.findISPbyIpv6, this.dao.findCoupleISPbyIpv6, function(res){
        next(null, res);
      });
    }
  }
}


ProviderLookUpFilter.prototype.executeCouple = function(af2ips, next){
  var ips, self, af;
  af = af2ips.af;
  ips = af2ips.ips;
  if(ips.length>1){
    ips  = _.filter(ips, function(ip){return ip!='*' && ip!='' && ip!=null });
    if(af==4){
      this.coupleHelper(ips, this.dao.findISPbyIpv4, this.dao.findCoupleISPbyIpv4, function(res){
        next(null, res);
      });
    }
    else {
     this.coupleHelper(ips, this.dao.findISPbyIpv6, this.dao.findCoupleISPbyIpv6, function(res){
       next(null, res);
     });
    }
  }
};

ProviderLookUpFilter.prototype.coupleHelper = function(ips, singleFinder, coupleFinder, resHandler) {
  if(ips.length==1){
    singleFinder.call(this.dao, ips[0], function(res){
      resHandler(['Unknown', res]);
    });
  }
  else if(ips.length==2){
    coupleFinder.call(this.dao, ips, resHandler);
  }
}

ProviderLookUpFilter.prototype.executeMany = function(af2ips, next) {
  var ips, self;
  if(af2ips.af == 4){
    ips = af2ips.ips;
    self = this;
    var limit = ips.length;
    if(limit==0 || ips==null) {
      return;
    }
    else{
      this.buffer = this.buffer.concat(ips);
      if(this.counter>=this.MAX_BUFFER_SIZE){
        console.log(this.buffer);
        this.dao.findISPSByIps(this.buffer, function(results){
            var providers = _.map(results, function(el) {
              if(el[0]!=null && el[0]!=undefined){
                var p=el[0].maxmind_provider;
                if(p!=null && p!=undefined && p!='Unknown') {
                  return p;
                }
              }
             });
            console.log(providers);
            self.serverSocket.sendBroadcastProvider(providers);
            next(null,providers);
            });
        this.buffer = [];
        this.counter = 0;
        }
      else {
        this.counter=this.counter+ips.length;
      }
  }
  }

}

module.exports = ProviderLookUpFilter;
