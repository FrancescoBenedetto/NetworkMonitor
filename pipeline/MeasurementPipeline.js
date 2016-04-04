var LookupFilter = require('./filters/LookupFilter');
var ProviderLookupFilter = require('./filters/ProviderLookupFilter');



var MeasurementPipeline = function(mdao, pdao, serverSocket){
  this.measurementFinder = new LookupFilter(mdao);
  this.providerFinder = new ProviderLookupFilter(pdao, serverSocket);
}

module.exports = MeasurementPipeline;
