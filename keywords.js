/**
 * Created by francesco on 21/04/16.
 */


 var getKeywords = function(nationality) {
    if(nationality=='english'){
        return [
            'outage',
            //'breakdown',
            'issue',
            'problem',
            'offline',
            'down',
            'not working',
            'interruption',
            //'trouble',
           // 'disconnection',
            'no connection',
            //'no internet access'
        ];
    }
};

module.exports = getKeywords;