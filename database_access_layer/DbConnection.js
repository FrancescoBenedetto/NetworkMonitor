var config = require('../dbConfig').dbConfig;
var Db = require('mongodb').Db;


var DbConnection = function() {
  var conf = config();
  this.connection = conf.conf;
  this.collections_conf = conf.collections;
}

DbConnection.prototype.connect = function(callback) {
  var db = new Db(this.connection.databases[0], new Server(this.connection.host, this.connection.port));
  db.open(function(err, db) {
    assert.equal(null, err);
    callback(db);
  }
}

DbConnection.prototype.setCollections = function(db) {
  //prepare collection objects
  var collections = {};
  collections.traceroute = {};
  collections.ping = {};
  //set traceroutes' collections
  collections.traceroute.most_recent_measurement=db.collection(this.collections_conf.traceroute.most_recent.name);
  collections.traceroute.couples = db.collection(this.collections_conf.ping.most_recent.name);
  //set pings' collections
  collections.ping.most_recent_measurement=db.collection(this.collections_conf.traceroute.couples.name);
  collections.ping.couples = db.collection(this.collections_conf.ping.couples.name);
  //set collecction's index
  collections.traceroute.most_recent_measurement.createIndex({this.collections_conf.traceroute.most_recent.index : 1});
  collections.ping.most_recent_measurement.createIndex({this.collections_conf.ping.most_recent.index : 1});

  return collections;
}

module.exports = DbConnection;
