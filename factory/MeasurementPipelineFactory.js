require('rootpath')();
var MeasurementCouplesMAO = require('database_access_layer/MeasurementCouplesMAO');
var ProviderSAO = require('database_access_layer/ProviderPsqlDAO');

var MeasurementPipelineFactory = function(couples_collection, connection, serverSocket){
  this.cdao = new MeasurementCouplesMAO(couples_collection);
  this.pdao = new ProviderSAO(connection);
  this.serverSocket = serverSocket;
}

MeasurementPipelineFactory.prototype.create = function(couples_collection, serverSocket) {
  
}
module.exports = MeasurementPipelineFactory;
