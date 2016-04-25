var async = require('async');
var MeasurementPipeline = require('./MeasurementPipeline');
//filters
var PingParserFilter = require('./filters/PingParserFilter');
var ProviderLookupFilter = require('./filters/LookupFilter');
//lookupFilter (taken by MeasurementPipeline)
var ComparePingFilter = require('./filters/ComparePingFilter');
//provider lookup filter, taken by MeasPipeline
var StatusKeeperFilter = require('./filters/StatusKeeperFilter2');
var PingProviderFilter = require('./filters/PingProviderFilter');
var PingTrackedFilter = require('./filters/PingTrackedFilter');
var ProviderTrackerFilter = require('./filters/ProviderTrackerFilter');

var PingPipeline = function(mdao, cdao, pdao, serverSocket){
  this.parser = new PingParserFilter();
  this.measurementFinder = new ProviderLookupFilter(mdao);
  this.comparator = new ComparePingFilter(mdao, cdao, serverSocket);
  this.statusKeeper = new StatusKeeperFilter(1);
  this.providerFinder = new PingProviderFilter(pdao);
  this.pingTracker = new PingTrackedFilter(serverSocket);
  this.providerTracker = new ProviderTrackerFilter();
}


PingPipeline.prototype.execute = function(ping, callback) {
  var self = this;
  async.waterfall([
    function start(next) { next(null, ping)},
    function parse(res, next) {self.parser.execute(res, next);},
    function lookup(res, next) {self.measurementFinder.execute(res, next);},
    function compare(res, next) {self.comparator.executeError(res, next);},
    function keepStatus(res, next) {self.statusKeeper.updateStatus(res, next);},
    function findProviders(res, next) {self.providerFinder.execute(res, next);},
    function trackPing(res, next) {self.pingTracker.execute(res, next);},
    function trackProviders(res, next) {self.providerTracker.execute(res, next);}
      ],
 callback
  );
}


module.exports = PingPipeline;
