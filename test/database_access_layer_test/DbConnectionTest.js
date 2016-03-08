var DB = require('../database_access_layer/DbConnection');

function prova() {
  var db = new DB('TEST');
  db.connect(function(datab){
    db.setTestCollections(datab);
  })
}

prova();
