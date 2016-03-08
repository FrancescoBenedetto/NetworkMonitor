var dbConfig = function() {

  var production_conf = {"host" : "localhost", "port" : "27017", "databases" : ["Ripe_Atlas"] };

  var production_collections = {
    ping : { most_recent_measurement : { name : 'most_recent_pings', index : 'id'},
            couples      : {name : 'ping_couples'}
          },
    traceroute : { most_recent_measurement : { name : 'most_recent_traceroutes', index : 'id'},
                  couples        :  {name : 'traceroute_couples'}
            },
    provider : { name : 'providers', indexes : { first : 'ipstart', second : 'ipend' }
            }


  };

  var test_conf = {"host" : "localhost", "port" : "27017", "databases" : ["Ripe_Atlas_Test"]};

  var test_collections = {
                measurement : {
                               most_recent_measurement : { name : 'measurements', index : 'id' },
                               couples : { name : 'couples'}
                            }
              };

  return { production : {conf : production_conf, collections : production_collections},
           test : {conf : test_conf, collections : test_collections}
              };


}


var socketConfig = function() {
  return {
    alert : 'alert',
    provider : 'provider'
  }
}

var serverConfig = function() {
  return {
    port : 3000
  }
}

module.exports.dbConfig = dbConfig;
module.exports.socketConfig = socketConfig;
module.exports.serverConfig = serverConfig;
