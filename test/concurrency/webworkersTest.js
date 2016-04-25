/**
 * Created by francesco on 05/04/16.
 */
require('rootpath')();
var Worker = require('webworker-threads').Worker;
var AlertsManager = require('concurrency/AlertsManager');

var example_setter = function(val) {
    var res =  function(){
        this.x = val;

        this.log = function(){
            console.log(this.x);
        }

        this.onmessage = function(message){
            console.log(message.data);
            this.x += 1;
            postMessage(this.x);
        }
    }

    return res;
}


var example = example_setter(1);

console.log(example);
/*
var example = function(){
    this.x = 1;

    this.onmessage = function(message){
        console.log(message.data);
        this.x += 1;
        postMessage(this.x);
    }
}
*/

//var example = new AlertsManager(3600, 900, 1);

//console.log(example);

var worker = new Worker(example);

worker.onmessage = function(event){
    console.log(event.data);
};

worker.postMessage(1);
//worker.postMessage(1);
setTimeout(function(){
    worker.terminate();
}, 2000);

