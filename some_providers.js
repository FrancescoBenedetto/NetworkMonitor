/**
 * Created by francesco on 11/04/16.
 */
require('rootpath')();
var DbConnection = require('database_access_layer/DbConnection');
var PsqlConnection = require('database_access_layer/PostgresqlDbConnection');
var PsqlDao = require('database_access_layer/ProviderPsqlDAO');
var _ = require('underscore');


//--------------



//set up connectors
//Mongodb
var dbConn = new DbConnection('PRODUCTION');
//connect to db
dbConn.connect(function(db){
    var psqlConnection = new PsqlConnection();
    var pdao = new PsqlDao(psqlConnection);
    //-----------
    var providersColl = db.collection('providersStatusesAnalysis_10_1');
    var analysisColl = db.collection('pingStatusesAnalysis_10_1');
    analysisColl.find().toArray(function(err, docs){
        docs.forEach(function(ping){
            if(ping.src!='' && ping.src!=null){
                if(ping.af==4){
                    pdao.findISPbyIpv4(ping.src, function(el){
                        if(el!=null){
                            providersColl.insertOne({'provider': el, 'k': ping.k, 'trash': (''+(ping.trash!=null))}, function(err, res){
                                if(err){
                                    throw err;
                                }
                            });
                        }
                    });
                }
                else{
                    pdao.findISPbyIpv6(ping.src, function(el){
                        if(el!=null){
                            providersColl.insertOne({'provider': el, 'k': ping.k, 'trash': (''+(ping.trash!=null))});
                        }
                    });
                }
            }

            if(ping.dst!='' && ping.dst!=null){
                if(ping.af==4){
                    pdao.findISPbyIpv4(ping.dst, function(el){
                        if(el!=null){
                            providersColl.insertOne({'provider': el, 'k': ping.k, 'trash': (''+(ping.trash!=null))});
                        }
                    });
                }
                else{
                    pdao.findISPbyIpv6(ping.dst, function(el){
                        if(el!=null){
                            providersColl.insertOne({'provider': el, 'k': ping.k, 'trash': (''+(ping.trash!=null))});
                        }
                    });
                }
            }
        });
    })

    });


