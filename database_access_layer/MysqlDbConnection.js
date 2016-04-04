var mysql = require('mysql');

var MysqlDbConnection = function(){
  this.pool = null
}

MysqlDbConnection.prototype.connect = function(){
  this.pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'maxmind_asn',
    multipleStatements: true
    //debug : 'false'
  });

  return this.pool;
}

module.exports = MysqlDbConnection;
