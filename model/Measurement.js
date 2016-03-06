
var Measurement = function(timestamp, src, dst) {
  this.id = src.concat('_'+dst);
  this.timestamp = timestamp;
  this.src = src;
  this.dst = dst;
}

module.exports = Measurement;
