/**
 * Created by francesco on 10/04/16.
 */
require('rootpath')();
var PingUtils = require('model/Ping');
var _ = require('underscore');





var StatusKeeperFilter2 = function(k) {
    this.k = k;
    this.observation_status = new PingStatusCollection();
    this.tracking_status = new PingStatusCollection();


    this.setK = function(k){
        this.k = k;
    };

    this.updateStatus = function(pings, next) {
        var inserted = null,
            removed = -1,
            actual = pings.incoming,
            old = pings.found;

        //(ok, err)
        if(PingUtils.nowUnreachable(old.result, actual.result)){
            this.observation_status.parseAndinsert(actual);
            /* console.log('timestamp: ' +actual.timestamp + ' id: '+ actual.prb_id);
             if(!(_.contains(this.tracked_probes, actual.prb_id))){
             this.tracked_probes.push(actual.prb_id);
             this.subscribe_to_prb(actual.prb_id, actual.timestamp);
             }*/
        }
        //(err, ok)
        else if(PingUtils.nowReachable(old.result, actual.result)){
            this.observation_status.remove(actual);
            removed = this.tracking_status.remove(actual);
        }
        //(err, err)
        else {
            var observedPing = this.observation_status.getById(actual.id);
            //isn't in tracking status yet
            if(observedPing != undefined){
                observedPing.k = observedPing.k + 1;
                if(observedPing.k==this.k){ //it's time to insert it in tracking
                 //   console.log('tracking');
                    this.observation_status.remove(old);
                    inserted = this.tracking_status.insert(observedPing);
                }
                //just update ping's k
                else{
                    this.observation_status.updatePing(observedPing);
                }

            }

        }
        
        //send changes in tracking status if happened
        if(inserted!=null){
            next(null, {action : 'inserted', ping: inserted});
        }
        else if(removed!=-1){
            next(null, {action : 'removed',ping:removed});
        }
    }
}

var NotWorkingStatus = function(socket){
    this.not_working_status = new PingStatusCollection();
    this.tracked_probes = [];
    this.socket = socket;

    this.track_probe = function(probe){
        if(!(_.contains(this.tracked_probes, probe))){
            this.tracked_probes.push(probe);
            this.socket.subscribe_to_prb(probe);
        }
    };

    this.untrack_probe = function(probe) {
        this.tracked_probes = _.without(this.tracked_probes, probe);
        this.socket.unsubscribe_to_prb(probe);
    }

    this.onProbeEvent = function(status, observation_status, tracking_status){
        if(status.event == 'connect'){
            var now_valid_msms_obs = _.filter(this.not_working_status, function(el){return el.prb.id==status.prb_id && el.from_status == 'obs'});
            now_valid_msms_obs.forEach(function(el){observation_status.insert(el)});
            var now_valid_msms_trck =  _.filter(this.not_working_status, function(el){return el.prb.id==status.prb_id && el.from_status == 'trck'});
            now_valid_msms_trck.forEach(function(el){tracking_status.insert(el)});

        }
        else { //on disconnect
            var removed_obs = observation_status.removeByProbe(status.prb_id);
            removed_obs.forEach(function(el){el.from_status = 'obs'; this.not_working_status.push(el);});
            var removed_trck = tracking_status.removeByProbe(status.prb_id);
            removed_trck.forEach(function(el){el.from_status = 'trck'; this.not_working_status.push(el);});
        }
    }
}

var PingStatusCollection = function() {
    this.array = [];

    var createObservationStatusObj = function(ping) {
        return {
            id : ping.id,
            src : ping.src,
            dst : ping.dst,
            timestamp : ping.timestamp,
            af : ping.af,
            k : 0,
            prb_id : ping.prb_id,
            result_type : ping.result_type
        }
    };

    this.remove = function(ping){
        var res;
        var index = _.findIndex(this.array, function(el){ return ping.id==el.id; });
        if(index!=-1){
            res = this.array.splice(index, 1);
            return res[0];
        }
        return index;
    };

    this.parseAndinsert = function(ping) {
        this.array.push(createObservationStatusObj(ping));
    };

    this.insert = function(ping) {
        this.array.push(ping);
        return ping;
    };

    this.removeByProbe = function(prb_id) {
        //update array removing elements with this prb id
        this.array  = _.filter(this.array, function(el){return el.prb_id != prb_id});
        //return all removed elements
        return _.filter(this.array, function(el){return el.prb_id == prb_id});
    };

    this.getById = function(id) {
        return _.find(this.array, function(el){return el.id==id});
    };

    this.updatePing = function(ping) {
        var index = _.findIndex(this.array, function(el) {return el.id==ping.id});
        this.array[index] = ping;
    }

}


module.exports = StatusKeeperFilter2;
