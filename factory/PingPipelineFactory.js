require('rootpath')();
var MeasurementPipelineFactory = require('factory/MeasurementPipelineFactory');
var PingPipeline = require('pipeline/PingPipeline');
var PingMAO = require('database_access_layer/PingMAO');

var PingPipelineFactory = function(measurement_collection, couples_collection, providers_collection, serverSocket){
  MeasurementPipelineFactory.call(this, couples_collection, providers_collection, serverSocket);
  this.mdao = new PingMAO(measurement_collection);
}

PingPipelineFactory.prototype.create = function() {
  return new PingPipeline(this.mdao, this.cdao, this.pdao, this.serverSocket);
}

module.exports = PingPipelineFactory;
