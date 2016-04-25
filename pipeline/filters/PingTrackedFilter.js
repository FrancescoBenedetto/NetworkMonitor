/**
 * Created by francesco on 18/04/16.
 */
var _ = require('underscore');


var PingTrackedFilter = function(serverSocket){
    this.serverSocket = serverSocket;
    this.tracked_pings = [];
    this.max_time = Date.now();
    this.min_time = Date.now() - 16*60*1000;
    this.time_changed = false;

    this.execute = function(action2ping, next) {
        var alert, removed, res;
        if(action2ping.action == 'removed') {
          removed = this.remove(action2ping.ping);
          this.update_time_onremove(removed);
          action2ping.ping.providers = removed.words;
        }
        else {
            action2ping.ping.timestamp = action2ping.ping.timestamp * 1000; //adapt to javascript's date
            alert = this.build_alert(action2ping.ping);
            this.tracked_pings.push(alert);
            this.update_time_oninsert(alert);
        }
        if(this.time_changed){
            res = {times : {max : this.max_time, min : this.min_time} ,pings : this.tracked_pings}
            this.serverSocket.sendBroadcastErrors(res);
            this.time_changed = false;
        }
        else {
            res = {times : null, pings : this.tracked_pings}
            this.serverSocket.sendBroadcastErrors(res);
        }
        //console.log(res);
        next(null, action2ping);
    };

    this.build_alert = function(ping){
        return {
            id : ping.id,
            timestamp : ping.timestamp,
            words : ping.providers
        }
    }

    this.remove = function(ping){
        var res;
        var index = _.findIndex(this.tracked_pings, function(el){ return ping.id==el.id; });
        if(index!=-1){
            res = this.tracked_pings.splice(index, 1);
            return res[0];
        }
        return index;
    };

    this.set_max_time = function(){
            var max =  _.max(this.tracked_pings, function(ping) {return ping.timestamp}).timestamp;
            this.max_time = max;
    };

    this.set_min_time = function() {
            var min =  _.min(this.tracked_pings, function(ping) {return ping.timestamp}).timestamp;
            this.min_time = min;
    };

    this.update_time_onremove = function(removed_ping) {
        if(removed_ping==-1){
            return;
        }
        if(this.tracked_pings.length > 1){
            if(removed_ping.timestamp == this.min_time){
                this.set_min_time();
                this.time_changed = true;
            }
            else if(removed_ping.timestamp == this.max_time) {
                this.set_max_time();
                this.time_changed = true;
            }
        }
        else if(this.tracked_pings.length == 1){
            this.min_time = removed_ping.timestamp;
            this.max_time = this.min_time + 1*60*1000;
            this.time_changed = true;
        }

    };

    this.update_time_oninsert = function(inserted_ping){
        if(this.tracked_pings.length==1){
            this.min_time = inserted_ping.timestamp;
            this.max_time = this.min_time + 1*60*1000;
            this.time_changed = true;
        }
        else{
            if(inserted_ping.timestamp > this.max_time){
                this.max_time = inserted_ping.timestamp;
                this.time_changed = true;
            }
            else if(inserted_ping.timestamp < this.min_time) {
                this.min_time = inserted_ping.timestamp;
                this.time_changed = true;
            }
        }
    };



};


module.exports = PingTrackedFilter;
