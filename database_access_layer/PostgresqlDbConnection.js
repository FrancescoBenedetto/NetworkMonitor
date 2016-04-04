/**
 * Created by francesco on 03/04/16.
 */

var pg = require('pg');

var PostgresqlDbConnection = function(){
    this.pool = null;
    this.config = "postgres://postgres:test@localhost/maxmind_providers";
}

PostgresqlDbConnection.prototype.getConnection = function(callback){
    pg.connect(this.config, function(err, client, done){
        if(err){
            done();
            throw err;
        }
        callback(client, done);
    });
}

module.exports = PostgresqlDbConnection;