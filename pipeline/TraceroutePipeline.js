var async = require('async');
var MeasurementPipeline = require('./MeasurementPipeline');
//filters
var TracerouteParserFilter = require('./filters/TracerouteParserFilter');
//lookupFilter (taken by MeasurementPipeline)
var CompareTracerouteFilter = require('./filters/CompareTracerouteFilter');
//lookupProviderFilter (taken by MeasurementPipeline)


var TraceroutePipeline = function(mdao, cdao, pdao, serverSocket){
  MeasurementPipeline.call(this, mdao, pdao, serverSocket);
  this.parser = new TracerouteParserFilter();
  this.comparator = new CompareTracerouteFilter(mdao, cdao, serverSocket);
}


TraceroutePipeline.prototype.execute = function(traceroute, callback) {
  var self = this;
  async.waterfall([
    function start(next) { next(null, traceroute)},
    function parse(res, next) {self.parser.execute(res, next);},
    function lookup(res, next) {self.measurementFinder.execute(res, next);},
    function compare(res, next) {self.comparator.executeLight(res, next);},
    function lookupProvider(res, next) {self.providerFinder.executeCouple(res, next);}
  ],
  callback
  );
}


module.exports = TraceroutePipeline;
