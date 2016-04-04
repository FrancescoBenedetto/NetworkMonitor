require('rootpath')();
var DB = require('database_access_layer/MysqlDbConnection');
var ProviderSAO = require('database_access_layer/ProviderSAO');
var FakeServerSocket = require('test/pipeline_test/FakeServerSocket');
var ProviderLookupFilter = require('pipeline/filters/ProviderLookupFilter');
var assert = require('assert');



describe('Lookup Filter Test with Mysql', function(){

  var db, connection, pdao, filter;

  before(function(done){

    ips = [
              "185.28.220.65",
              "213.224.206.81",
              "93.48.249.105"
            ];
      ips2 = ["213.224.206.81"];
      db = new DB();
      connection = db.connect();
      pdao = new ProviderSAO(connection);
      serverSocket = new FakeServerSocket();
      filter = new ProviderLookupFilter(pdao, serverSocket);
      done();
  })

  it('perform a lookup with some given ips', function(done){
    filter.execute({af:4, ips:ips2}, console.log);
    filter.execute({af:4, ips:ips}, function(res){
      console.log(res);
      //done();
    });
  });

})
