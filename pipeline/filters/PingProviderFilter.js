/**
 * Created by francesco on 18/04/16.
 */
var _ = require('underscore');

var PingProviderFilter = function(dao){
    this.dao = dao;

    this.execute = function(action2ping, next){
        var ips = this.getIps(action2ping.ping);
        if(action2ping.action=='inserted'){
            this.lookUpProvider(ips, action2ping.ping.af, function(providers){
                action2ping.ping.providers = providers;
                next(null, action2ping);
            });
        }
        else {
            next(null, action2ping);
        }
    };

    this.executeComcast = function(ping, next){
        var ips = this.getIps(action2ping.ping);
        if(action2ping.action=='inserted'){
            this.lookUpProvider(ips, action2ping.ping.af, function(providers){
                action2ping.ping.providers = providers;
                if(providers.indexOf('Comcast Cable Communications, Inc.')!=-1){
                    console.log(action2ping);
                    next(null, action2ping);
                }
            });
        }
        else {
            next(null, action2ping);
        }
    };
    
    this.executeSingle = function(ping, next){
        var ips = [];
        if(ping.src!=''){
            ips.push(ping.src);
        }
        if(ping.dst!=''){
            ips.push(ping.dst);
        }
        if(ips.length>0){
            this.lookUpProvider(ips, ping.af, function(providers){
                if(providers.indexOf('Comcast Cable Communications, Inc.')!=-1){
                    ping.providers = providers;
                    next(null, ping);
                }
            });
        }
    };

    this.lookUpProvider = function(ips, af, callback){
        if(ips.length==0){
            callback(['Unknown', 'Unknown']);
        }
        else if(ips.length==1){
            this.findProvider(ips[0], af, callback);
        }
        else {
            this.findProviders(ips, af, callback);
        }
    }
    
    this.findProvider = function(ip, af, callback) {
        if(af==4){
            this.dao.findISPbyIpv4(ip, function(res){
                callback(['Unknown', res]);
            });
        }
        else if(af==6) {
            this.dao.findISPbyIpv6(ip, function(res){
                callback(['Unknown', res]);
            });
        }
    };
    
    this.findProviders = function(ips, af, callback){
      if(af==4){
          this.dao.findCoupleISPbyIpv4(ips, function(res){
              callback(res);
          });
      }
        else if(af==6){
          this.dao.findCoupleISPbyIpv6(ips, function(res){
              callback(res);
          });
      }
    };
 


    this.getIps = function(ping) {
        var ips = [];
        if(ping.src!=null && ping.src!='Unknown' && ping.src!='' && ping.src!='*'){
            ips.push(ping.src);
        }
        if(ping.dst!=null && ping.dst!='Unknown' && ping.dst!='' && ping.dst!='*'){
            ips.push(ping.dst);
        }

        return ips;
    }
}

module.exports = PingProviderFilter;