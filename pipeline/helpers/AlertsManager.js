/**
 * Created by francesco on 05/04/16.
 */

var AlertsManager = function(interval, alerts_length, changes_number, postMessage){
        this.alerts = Array(alerts_length + 1).fill(0);
        this.alerts_length = alerts_length + 1; //+1 because of the mapping: indexes go from [0 , alerts_length], alerts_l included
        this.min_time = Date.now();
        this.max_time = this.min_time + interval;
        this.interval = interval;
        this.changes_number = changes_number;
        this.postMessage = postMessage;
        this.changes = 0;
        this.array_shifter= new Worker(function(){
            
            this.onmessage = function(data) {
                var timestamp  = data.timestamp;
                var min_time = data.min_time
            }
        })    
        

        this.fill = function() {
            this.alerts = Array(this.alerts_length).fill(0);
        }
    
        this.send = function() {
            if (this.changes == this.changes_number) {
                this.changes = 0;
                postMessage(this.alerts);
            }
            else {
                this.changes++;
            }
        }

        this.insert = function(timestamp) {
            if (timestamp < this.min_time) {
                return;
            }
            else if (timestamp >= this.min_time && timestamp <= this.max_time) {
                this.alerts[this.to_index(timestamp)] += 1;
            }
            else {
                this.update(timestamp);
                this.alerts[this.alerts_length - 1] += 1;
            }
        }

        this.to_index = function(timestamp) {
            if (timestamp > this.min_time) {
                console.log('error: min time must be higher than timestamp');
                throw 'error inside alert manager';
            }
            var second = (Math.floor(timestamp - this.min_time) / 1000);
            var mapping_factor = Math.floor(interval / this.alerts_length);
            var mapped_second = Math.floor(second / mapping_factor);
            return mapped_second;
        }

        this.update = function(timestamp) {
            var new_min_time = timestamp - interval;
            var shifts = this.to_index(new_min_time);
            //update array
            var i = 0;
            while (i < shifts) {
                this.alerts.shift();
                this.alerts.push(0);
                i++;
            }
            //update min and max time
            this.min_time = new_min_time;
            this.max_time = timestamp;

        }
    

}

module.exports = AlertsManager;