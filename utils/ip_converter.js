
function inet_aton(address) {
                  splitted_address = address.split('.');
                  integer_ip = ( 16777216 * parseInt(splitted_address[0]) )
                             + (    65536 * parseInt(splitted_address[1]) )
                             + (      256 * parseInt(splitted_address[2]) )
                              +             parseInt(splitted_address[3]);
                   return integer_ip;
}

function inet_ntoa(ipnum, callback) {
  o1 = Math.floor( ipnum / 16777216 ) % 256;
  o2 = Math.floor( ipnum / 65536    ) % 256;
  o3 = Math.floor( ipnum / 256      ) % 256;
  o4 = Math.floor( ipnum            ) % 256;
   callback(o1+"."+o2+"."+o3+"."+o4);
}


module.exports.inet_aton = inet_aton;
module.exports.inet_ntoa = inet_ntoa;
