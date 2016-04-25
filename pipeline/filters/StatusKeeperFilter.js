/**
 * Created by francesco on 08/04/16.
 */
require('rootpath')();
var PingUtils = require('model/Ping');
var _ = require('underscore');


var StatusKeeperFilter = function(k, atlasSocket) {
    this.k = k;
    this.observation_status = [];
    this.tracking_status = [];
    this.notWorking_status = [];
    this.tracked_probes = [];
    this.trash = [];
    this.socket = atlasSocket;


    this.setK = function(k){
        this.k = k;
    };

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

    var removePing = function(array, ping){
        var index = _.findIndex(array, function(el){ return ping.id==el.id; });
        if(index!=-1){
           return array.splice(index, 1);
        }
        return index;
    }

    var removeByPrb = function(array, prb_id){
        //update array removing elements with this prb id
        array  = _.filter(array, function(el){return el.prb_id != prb_id});
        //return all elements matching this prb id
        return _.filter(array, function(el){return el.prb_id == prb_id});
    }


    this.setSocketEvent = function() {
        console.log('socket event set');
        this.socket.on('atlas_probestatus', function(status){
           //console.log(status);
            console.log('recieved probe status: '+status);
        });

        /* var self = this;
         this.socket.on("atlas_probestatus", function(status){
             if(status.event == 'connect'){
                 var now_valid_msms_obs = _.filter(self.notWorking_status, function(el){return el.prb.id==status.prb_id && el.from_status == 'obs'});
                 now_valid_msms_obs.forEach(function(el){this.observation_status.push(el)});
                 var now_valid_msms_trck =  _.filter(self.notWorking_status, function(el){return el.prb.id==status.prb_id && el.from_status == 'trck'});
                 now_valid_msms_trck.forEach(function(el){self.tracking_status.push(el)});

             }
             else { //on disconnect
                 var removed_obs = removeByPrb(self.observation_status, status.prb_id);
                 removed_obs.forEach(function(el){el.from_status = 'obs'; self.notWorking_status.push(el);});
                 var removed_trck = removeByPrb(self.tracking_status, status.prb_id);
                 removed_trck.forEach(function(el){el.from_status = 'trck'; self.notWorking_status.push(el);});
             }

         });*/
    };

    //this.setSocketEvent();


    this.updateStatus = function(pings) {
        var actual = pings.incoming,
            old = pings.found;

        //(ok, err)
        if(PingUtils.nowUnreachable(old.result, actual.result)){
            this.observation_status.push(createObservationStatusObj(actual));
            /* console.log('timestamp: ' +actual.timestamp + ' id: '+ actual.prb_id);
            if(!(_.contains(this.tracked_probes, actual.prb_id))){
                this.tracked_probes.push(actual.prb_id);
                this.subscribe_to_prb(actual.prb_id, actual.timestamp);
            }*/
        }
            //(err, ok)
        else if(PingUtils.nowReachable(old.result, actual.result)){
            var to_trash1 = removePing(this.observation_status, actual);
            var to_trash2 = removePing(this.tracking_status, actual);
            //for analysis
            if(to_trash1 != -1){
                to_trash1 = to_trash1[0];
                to_trash1.from_status = 'obs';
                this.trash.push(to_trash1);
            }
            
            if(to_trash2 != -1){
                to_trash2 = to_trash2[0];
                to_trash2.from_status = 'trck';
                this.trash.push(to_trash2);
            }
          //  unsubscribe_to_prb(actual.prb_id);
        }
        //(err, err)
        else {
            var observedPing = _.find(this.observation_status, function(el){return actual.id==el.id});
            //isn't in tracking status yet
            if(observedPing != undefined){
                observedPing.k = observedPing.k + 1;
                //it's time to insert it in tracking
                if(observedPing.k==this.k){
                    removePing(this.observation_status, old);
                    this.tracking_status.push(observedPing);
                }
                //just update ping's k
                else{
                    var index = _.findIndex(this.observation_status, function(el) {return el.id==observedPing.id});
                    this.observation_status[index] = observedPing;
                }

            }

        }
    }
}

module.exports = StatusKeeperFilter;

