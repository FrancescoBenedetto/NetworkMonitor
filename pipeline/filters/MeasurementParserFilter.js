/**
 * Created by francesco on 31/03/16.
 */

var MeasurementParserFilter = function(){}

MeasurementParserFilter.prototype.getAddressFamily = function(af, mode, address) {
    if(af!=null){
        return af;
    }
    else if(mode!=null){
        if(mode=='ICMP4'){
            return 4;
        }
        else {
            return 6;
        }
    }
    else {
        if(address.indexOf('.')!=-1){
            return 4;
        }
        else{
            return 6;
        }
    }
}

module.exports = MeasurementParserFilter;
