var async = require('async');
var MeasurementPipeline = require('./MeasurementPipeline');
//filters
var PingParserFilter = require('./filters/PingParserFilter');
//lookupFilter (taken by MeasurementPipeline)
var ComparePingFilter = require('./filters/ComparePingFilter');
//provider lookup filter, taken by MeasPipeline

var PingPipeline = function(mdao, cdao, pdao, serverSocket){
  MeasurementPipeline.call(this, mdao, pdao, serverSocket);
  this.parser = new PingParserFilter();
  this.comparator = new ComparePingFilter(mdao, cdao, serverSocket);
}


PingPipeline.prototype.execute = function(ping, callback) {
  var self = this;
  async.waterfall([
    function start(next) { next(null, ping)},
    function parse(res, next) {self.parser.execute(res, next);},
    function lookup(res, next) {self.measurementFinder.execute(res, next);},
    function compare(res, next) {self.comparator.executeOnChanges(res, next);},
    function lookupProvider(res, next) {self.providerFinder.executeCouple(res, next);}
      ],
 callback
  );
}


module.exports = PingPipeline;
