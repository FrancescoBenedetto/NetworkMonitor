require('rootpath')();
var MeasurementPipelineFactory = require('factory/MeasurementPipelineFactory');
var TraceroutePipeline = require('pipeline/TraceroutePipeline');
var TracerouteMAO = require('database_access_layer/TracerouteMAO');

var TraceroutePipelineFactory = function(measurement_collection, couples_collection, providers_collection, serverSocket){
  MeasurementPipelineFactory.call(this, couples_collection, providers_collection, serverSocket);
  this.mdao = new TracerouteMAO(measurement_collection);
}

TraceroutePipelineFactory.prototype.create = function() {
  return new TraceroutePipeline(this.mdao, this.cdao, this.pdao, this.serverSocket);
}

module.exports = TraceroutePipelineFactory;
