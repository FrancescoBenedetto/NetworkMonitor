var dbConfig = function() {

  var conf = {"host" : "localhost", "port" : "27017", "databases" : ["Ripe_Atlas"] };

  var collections = {
    ping : { most_recent : { name : 'most_recent_pings', index : 'id'},
            couples      : {name : 'ping_couples'}
          },
    traceroute : { most_recent : { name : 'most_recent_traceroutes', index : 'id'},
                  couples        :  {name : 'traceroute_couples'}
            },
    provider : { name : 'providers', indexes : { first : 'ipstart', second : 'ipend' }
            }


  };

  return { conf : conf, collections : collections};


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

module.exports = dbConfig;
module.exports = socketConfig;
module.exports = serverConfig;
