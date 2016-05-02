var dbConfig = function() {

  var production_conf = {
                        "host" : "localhost",
                        "port" : "27017",
                        "databases" : ["Ripe_Atlas_Historical"]
                      };

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
    provider : 'provider',
      errors : 'errors'
  };
}

var serverConfig = function() {
  return {
    port : 3000
  };
}

var twitterConfig = function() {
  var connection_parameters = {
  consumer_key: 'AOMY8P7iLLHQJWLzwN5jlsB59',
  consumer_secret: 'HfoH6k5YqTbyP2f2KaeFFsWe1c8OTKyJ0L0zSyEDW7AkvdD8g5',
  access_token: '3078193287-TKT6n2sG1bmRIWx1NbDJ428NAC9EW9R54HcUsGV',
  access_token_secret: 'lVJfDQfoQ9aeryO0U84XoYG3caIoFrA9LeexEqNPPPGx9'
};
    
  return connection_parameters;
};

module.exports.dbConfig = dbConfig;
module.exports.socketConfig = socketConfig;
module.exports.serverConfig = serverConfig;
module.exports.twitterConfig = twitterConfig;
