var MeasurementCouple = function() {}

MeasurementCouple.prototype.build = function(m1, m2) {
  if(m1.id!=m2.id){
    console.log('error: can\'t create a couple of measurement with different src and dst');
    return null;
  }
  else{
    var couple = {};
    couple.id = m1.id;
    couple.src = m1.src;
    couple.dst = m1.dst;
    couple.older_timestamp = m2.timestamp;
    couple.newer_timestamp = m1.timestamp;
    return couple;
  }
}

module.exports = MeasurementCouple;
