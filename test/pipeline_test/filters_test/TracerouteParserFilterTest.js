require('rootpath')();
var TracerouteParserFilter = require('pipeline/filters/TracerouteParserFilter');
var assert = require('assert');
var atlas_traceroutes = require('test/pipeline_test/filters_test/atlas_traceroutes')();



describe('Lookup Filter Test', function(){

  var measurement, filter;

  before(function(done){
    filter = new TracerouteParserFilter();
    measurement = atlas_traceroutes.traceroute1;
      done();
    })

  after(function(done){
    done();
  })

  afterEach(function(done){
      done();
    });


  it('parse an atlas traceroute', function(done){
      filter.execute(measurement, function(err, res) {
        console.log(res);
        done();
    });
  });


})
