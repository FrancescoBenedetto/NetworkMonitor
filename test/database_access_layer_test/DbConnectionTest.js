var DbConnection = require('../database_access_layer/DbConnection');

describe('Test the mongo database connection', function(){
  var db;

  before(function(done){
    connection = new DbConnection('TEST');
  })

  after(function(done){
    //collection.remove({});
    db.close();
    done();
  });

  it('should connect to database', function(done){

  })

})
