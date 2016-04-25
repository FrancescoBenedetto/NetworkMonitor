/**
 * Created by francesco on 01/04/16.
 */

var PingProviderAnalysisFilter = function(collectionTotal, collectionCouples){
    this.total = new ProviderCounterHelper(collectionTotal, 'couple');
    this.couples = new ProviderCounterHelper(collectionCouples, 'single');
}

PingProviderAnalysisFilter.prototype.execute = function(couple) {
    this.total.insertDouble(couple);
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
        console.log('inserting 300 couples providers');
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

module.exports = PingProviderAnalysisFilter;