var ProviderSAO = function(pool){
  this.pool = pool;
}

ProviderSAO.prototype.getConnection = function(callback) {
  this.pool.getConnection(function(err, connection){
    if(err) {
      connection.release();
      console.log('code: 100, status: Error connecting Database');
      throw err;
    }
    else {
      callback(connection);
    }
  });
}

ProviderSAO.prototype.findISPByIp = function(ip, callback) {
  var sql = 'SELECT maxmind_provider FROM Maxmind_ASN WHERE INET_ATON(\''+ip+'\') BETWEEN maxmind_ipstart AND maxmind_ipend';
  this.getConnection(function(connection){
      connection.query(sql, function(err, row){
        if(err){
          connection.release();
          console.log('query error');
          throw err;
        }
        else {
          connection.release();
          if(row[0]!=undefined && row[0]!=null){
            callback(row[0].maxmind_provider.replace('\r', ''));
          }
          else {
            callback(null);
          }
        }
      });
  });
}

ProviderSAO.prototype.findISPSByIps = function(ips, callback) {
  var sql = '';
  var number_ips = ips.length;
  for(var i=0;i<number_ips;i++){
    sql += 'SELECT maxmind_provider FROM Maxmind_ASN WHERE INET_ATON(?) BETWEEN maxmind_ipstart AND maxmind_ipend;';
  }
  this.getConnection(function(connection){
    connection.query(sql, ips, function(err, results){
      connection.release();
      if(err){
        console.log('Error querying findISPSByIps');
        throw err;
      }
      else {
        if(results!=undefined) {


          if (results.length == 1) {

            if(results[0]!=null){
              results = [results[0].maxmind_provider.replace('\r', '')];
            }
            else {
              results = ['Unknown'];
            }
          }
          else {
            results = results.map(function(row) {
              if(row[0]!=null){
                return row[0].maxmind_provider.replace('\r', '');
              }
              else {
                return 'Unknown';
              }
            });
          }
          callback(results);
        }
        else {
          callback(null);
        }
      }
    });
  })
}

/*
var DB = require('./MysqlDbConnection');
var db = new DB();
var connection = db.connect();
var pdao = new ProviderSAO(connection);
pdao.findISPByIp('80.231.138.22', console.log);
pdao.findISPByIp('89.149.186.77', console.log);
*/
module.exports = ProviderSAO;
