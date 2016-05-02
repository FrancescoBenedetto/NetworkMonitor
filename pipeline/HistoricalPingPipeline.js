/**
 * Created by francesco on 30/04/16.
 */
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

var HistoricalPingPipeline = function(pdao){
    this.parser = new PingParserFilter();
    this.providerFinder = new PingProviderFilter(pdao);
}


HistoricalPingPipeline.prototype.execute = function(ping, callback) {
    var self = this;
    async.waterfall([
            function start(next) { next(null, ping)},
            function parse(res, next) {self.parser.execute(res, next);},
            function findProviders(res, next) {self.providerFinder.executeSingle(res, next);},
    ],
        callback
    );
}


module.exports = HistoricalPingPipeline;
