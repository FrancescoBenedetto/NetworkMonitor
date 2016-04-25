/**
 * Created by francesco on 03/04/16.
 */

var ProviderPsqlDAO = function(pool){
    this.pool = pool;
}

ProviderPsqlDAO.prototype.findISPbyIpv4 = function(ip, callback) {
    var sql = "SELECT maxmind_provider FROM maxmind_providers_v4 WHERE iprange @> to_bigint($1) LIMIT 1";
    this.executeQuery(sql, [ip], this.handleResult, callback);
}

ProviderPsqlDAO.prototype.findISPbyIpv6 = function(ip, callback) {
    var sql = "SELECT maxmind_provider FROM maxmind_providers_v6 WHERE iprange >>= $1 LIMIT 1";
    this.executeQuery(sql, [ip], this.handleResult, callback);
}

ProviderPsqlDAO.prototype.findCoupleISPbyIpv4 = function(ips, callback) {
    var sql = "SELECT maxmind_provider FROM maxmind_providers_v4 WHERE iprange @> to_bigint($1) OR iprange @> to_bigint($2) LIMIT 2";
    this.executeQuery(sql, ips, this.handleCoupleResult, callback);
}

ProviderPsqlDAO.prototype.findCoupleISPbyIpv6 = function(ips, callback){
    var sql = "SELECT maxmind_provider FROM maxmind_providers_v6 WHERE iprange >>= $1 OR iprange >>= $2 LIMIT 2";
    this.executeQuery(sql, ips, this.handleCoupleResult, callback);
}

ProviderPsqlDAO.prototype.executeQuery = function(sql, values, handler, callback) {
    this.pool.getConnection(function(client, done){
        client.query(sql, values, function(err, result){
            done();
            if(err){
                console.log(values);
                throw err;
            }
            handler(result, callback);
        });
    });
}

ProviderPsqlDAO.prototype.handleResult = function(result, callback) {
    if(result.rows==null || result.rows[0]==null){
        callback('Unknown');
    }
    else{
        callback(result.rows[0].maxmind_provider);
    }
}

ProviderPsqlDAO.prototype.handleCoupleResult = function(result, callback){
    if(result.rows==null || result.rows.length==0){
        callback(['Unknown', 'Unknown']);
    }
    else if(result.rows.length==1){
        callback([result.rows[0].maxmind_provider, 'Unknown']);
    }
    else {
        callback([result.rows[0].maxmind_provider, result.rows[1].maxmind_provider]);
    }
}

module.exports = ProviderPsqlDAO;