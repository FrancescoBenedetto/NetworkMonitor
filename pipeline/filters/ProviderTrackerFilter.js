/**
 * Created by francesco on 22/04/16.
 */
var _ = require('underscore');

var keywords = require('../../keywords.js')('english');

var ProviderTrackerFilter = function(){
    this.trackingProviders = [];
    this.keywords = keywords;

    this.execute = function(action2ping, next){
       // console.log(action2ping);
        var action = action2ping.action,
            providers = action2ping.ping.providers;

        if(action=='inserted'){
            this.insertCouple(providers);
        }
        else{
            this.removeCouple(providers);
        }
        //console.log(this.trackingProviders);
        next(null, this.trackingProviders);
    };

    this.insertProvider = function(provider){
        var index, tracked_provider;
        if(provider!='Unknown' && provider!='null'){
            index = _.findIndex(this.trackingProviders, function(el){return el.name==provider});
            if(index!=-1){
                tracked_provider = this.trackingProviders[index];
                tracked_provider.nominations += 1;
                this.trackingProviders[index] = tracked_provider;
            }
            else{
                this.trackingProviders.push({name : provider, nominations:1});
            }
        }
    };

    this.removeProvider = function(provider){
        var found_provider, index, res;
        if(provider!='Unknown' && provider!=null){
            index = _.findIndex(this.trackingProviders, function(el){ return provider==el.name; });
            if(index!=-1){
                found_provider = this.trackingProviders[index];
                //was the last ping in tracking with this provider
                if(found_provider.nominations==1){
                    res = this.trackingProviders.splice(index, 1);
                    return res[0];
                }
                else {
                    //decrease number of nominations
                    found_provider.nominations = found_provider.nominations - 1;
                    this.trackingProviders[index] = found_provider;
                    return found_provider;
                }
            }
        }
    };

    this.insertCouple = function(couple){
        var self = this;
        if(couple != null){
            couple.forEach(function(provider){
                self.insertProvider(provider);
            });
        }
        else{
            console.log(couple);
        }
        
    };

    this.removeCouple = function(couple){
        var self = this;
        if(couple != null){
            couple.forEach(function(provider){
                self.removeProvider(provider);
            });
        }
        else{
            console.log(couple);
        }
        
    };


    this.orderByOccurency = function(){
        var providers = Object.create(this.trackingProviders);
        providers.sort(function(ela, elb){ return elb.nominations - ela.nominations});
        return providers.map(function(el){return el.name});
    };

    this.addKeywords = function(providers){
        var words = [],
            self = this;
        providers.forEach(function(providerName){
            self.keywords.forEach(function(keyword){
                words.push(providerName.concat(' '+ keyword));
            });
        });

        return words;
    };

    this.countWords = function(providers) {
        var total_words = 0;
        providers.forEach(function(provider){
            total_words += provider.split(' ').length;
        });
        return total_words;
    };

    this.cutWords = function(number, array) {
        var i = 0,
            cutted_words,
            old_length,
            new_length;
        old_length = array.length;
        array = _.filter(array, function(el){return el.length<=55;});
        new_length = array.length;
        i = i + ((old_length - new_length) * 55);
        while(i<=number){
            cutted_words = array.pop().split(' ').length;
            i += cutted_words;
        }
        return array;
    };

    this.prepareWordsToStream = function() {
        var ordered = this.orderByOccurency();
        var prov_keyw = this.addKeywords(ordered);
        var count = this.countWords(prov_keyw);
        if(count>400){
            var numberToCut = count - 400;
            return this.cutWords(numberToCut, prov_keyw);
        }
        else {
            return prov_keyw;
        }
    };

};

module.exports = ProviderTrackerFilter;