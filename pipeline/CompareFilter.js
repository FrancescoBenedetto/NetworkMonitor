var Db_ClientFilter = require('./Db_ClientAccessFilter');


var CompareFilter = function(dao, serverSocket) {
  Db_ClientFilter.call(this, dao, serverSocket);
}
