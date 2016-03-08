var conf = require('../config').dbConfig();
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;



var DbConnection = function(mode) {
  if(mode=='TEST') {
    this.connection = conf.test.conf;
    this.collections_conf = conf.test.collections;
  }
  else if(mode=='PRODUCTION') {
    this.connection = conf.production.conf;
    this.collections_conf = conf.production.collections;
  }
  else {
    console.log('THIS MODE DOESN\'T EXISTS');
  }

}

DbConnection.prototype.connect = function(callback) {
  var db = new Db(this.connection.databases[0], new Server(this.connection.host, this.connection.port));
  db.open(function(err, db) {
    if(err){
      throw err;
    }
    else{
    callback(db);
  }
  });
}

DbConnection.prototype.setCollections = function(db) {
  //prepare collection objects
  var collections = {};
  collections.traceroute = {};
  collections.ping = {};
  //set traceroutes' collections
  collections.traceroute.most_recent_measurement_measurement=db.collection(this.collections_conf.traceroute.most_recent_measurement.name);
  collections.traceroute.couples = db.collection(this.collections_conf.ping.most_recent_measurement.name);
  //set pings' collections
  collections.ping.most_recent_measurement_measurement=db.collection(this.collections_conf.traceroute.couples.name);
  collections.ping.couples = db.collection(this.collections_conf.ping.couples.name);
  //set collecction's index
  collections.traceroute.most_recent_measurement_measurement.createIndex({'id' : 1});
  collections.ping.most_recent_measurement_measurement.createIndex({'id' : 1});

  return collections;
}

DbConnection.prototype.setTestCollections = function(db) {
  var collections = {};
  var testCollection = db.collection(this.collections_conf.measurement.most_recent_measurement.name);
  testCollection.createIndex({ 'id' : 1});
  collections.measurement = testCollection;
  collections.couples = db.collection(this.collections_conf.measurement.couples.name);
  return collections;
}

module.exports = DbConnection;
