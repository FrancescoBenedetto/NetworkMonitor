/**
 * Created by francesco on 30/03/16.
 */
var _ = require('underscore');

var TracerouteProviderAnalysisFilter = function(collectionAA, collectionAB, collectionABTotal, collectionAsterisk, collectionUnknown, collectionTotal, collectionCouples){
    this.AA = new ProviderCounterHelper(collectionAA, 'single');
    this.AB = new ProviderCounterHelper(collectionAB, 'couple');
    this.ABTotal = new ProviderCounterHelper(collectionABTotal, 'double');
    this.asterisk = new ProviderCounterHelper(collectionAsterisk, 'single');
    this.unknown = new ProviderCounterHelper(collectionUnknown, 'single');
    this.total = new ProviderCounterHelper(collectionTotal, 'single');
    this.totalCouple = new ProviderCounterHelper(collectionCouples, 'couple');
}

TracerouteProviderAnalysisFilter.prototype.execute = function(couple) {
    if(couple.length<2){
        return;
    }
    if(_.contains(couple, '*')){
      this.asterisk.insert(couple);
    }
    else if(_.contains(couple, 'Unknown')){
        this.unknown.insert(couple);
    }
    else if(couple[0]==couple[1]){
        this.AA.insert(couple);
    }
    else if(couple[0]!=couple[1]){
        this.AB.insert(couple);
        this.ABTotal.insertDouble(couple);
    }
    this.total.insertDouble(couple);
    this.totalCouple.insert(couple);
    
}

var ProviderCounterHelper = function(collection, mode) {
    this.collection = collection;
    this.array = [];
    this.i = 0;
    if(mode=='single') {
        this.creator = this.create;
    }
    else {
        this.creator = this.createCouple;
    }
}

ProviderCounterHelper.prototype.insert = function(el) {
    this.array.push(this.creator(el));
    this.i++;
    if(this.i==300){
        console.log('inserting 300 providers');
        this.collection.insertMany(this.array, function(err, res){
            if(err){
                throw err;
            }
        });
        this.array = [];
        this.i=0;
    }
}

ProviderCounterHelper.prototype.insertDouble = function(el) {
    this.array.push({'provider' : el[0], 'timestamp' : Date.now()});
    this.array.push({'provider' : el[1], 'timestamp' : Date.now()});
    this.i++;
    if(this.i==300){
        console.log('inserting 600 providers');
        this.collection.insertMany(this.array, function(err, res){
            if(err){
                throw err;
            }
        });
        this.array = [];
        this.i=0;
    }
}

ProviderCounterHelper.prototype.createCouple = function(el) {
    return { 'provider1' : el[0], 'provider2': el[1]};
}

ProviderCounterHelper.prototype.create = function(el){
    return {'provider' : el[1]};
}


module.exports = TracerouteProviderAnalysisFilter;
