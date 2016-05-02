/**
 * Created by francesco on 01/05/16.
 */
var Client = require('node-rest-client').Client;

var AtlasRestRetriever = function(startTime, endTime){
    this.startTime = startTime;
    this.endTime = endTime;
    this.client = new Client();

    this.retrieve = function(msm_id, callback) {
        var self = this;
        this.client.get("https://atlas.ripe.net/api/v1/measurement/" + msm_id + "/result/?start=" + self.startTime + "&stop=" + self.endTime + "",
            /* function (data, response) {
             // parsed response body as js object
             //console.log(data);
             console.log(data.length);
             console.log(data[0]);
             // raw response
             // console.log(response);
             });*/
            callback);
    }
};

/*
var startTime = Math.floor(new Date(2016, 03, 29).getTime()/1000);
var endTime = Math.floor(new Date(2016, 03, 30).getTime()/1000);

var ret = new AtlasRestRetriever(startTime, endTime);
ret.retrieve(1879038);
*/

module.exports = AtlasRestRetriever;