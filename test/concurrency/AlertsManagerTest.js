/**
 * Created by francesco on 05/04/16.
 */
require('rootpath')();
var AlertsManager = require('concurrency/AlertsManager');
var Worker = require('webworker-threads').Worker;
var assert = require('assert');


describe('alert manager test', function(){
    var manager, worker,
        interval = 3600,
        array_length = 900;

    before(function(done){

        manager = new AlertsManager(interval, array_length, 1);
        worker = new Worker(function(){
            this.onmessage = function(event) {
                console.log(event.data);
                postMessage([1,1]);
            }

        });
    });

    after(function(done){
        worker.terminate();
        done();
    });

    it('sends 2 timestamps to the worker and expects the array of timestamps is filled in first and last position', function(done){
        worker.onmessage = function(event){
            var array = event.data;
            console.log(array);
           // assert.equal(array[0], 1);
          //  assert.equal(array[array_length], 1);
            done();
        };
        worker.postMessage(1);
        //worker.postMessage(manager.max_time);

       });
});