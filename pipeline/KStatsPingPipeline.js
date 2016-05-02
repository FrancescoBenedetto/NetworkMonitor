/**
 * Created by francesco on 02/05/16.
 */
var async = require('async');
var MeasurementPipeline = require('./MeasurementPipeline');
//filters
var PingParserFilter = require('./filters/PingParserFilter');
var ProviderLookupFilter = require('./filters/LookupFilter');
//lookupFilter (taken by MeasurementPipeline)
var ComparePingFilter = require('./filters/ComparePingFilter');
//provider lookup filter, taken by MeasPipeline
var StatusKeeperFilter = require('./filters/StatusKeeperFilter');

var KStatsPingPipeline = function(mdao, cdao){
    this.parser = new PingParserFilter();
    this.measurementFinder = new ProviderLookupFilter(mdao);
    this.comparator = new ComparePingFilter(mdao, cdao);
    this.statusKeeper = new StatusKeeperFilter(1, null);
}


KStatsPingPipeline.prototype.execute = function(ping, callback) {
    var self = this;
    async.waterfall([
            function start(next) { next(null, ping)},
            function parse(res, next) {self.parser.execute(res, next);},
            function lookup(res, next) {self.measurementFinder.execute(res, next);},
            function compare(res, next) {self.comparator.executeError(res, next);},
            function keepStatus(res, next) {self.statusKeeper.updateStatus(res, next);}
        ],
        callback
    );
}


module.exports = KStatsPingPipeline;
