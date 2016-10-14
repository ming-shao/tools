var AWS = require('aws-sdk');
var ju_comp = require('json-url');
var Q = require('q');
var __ = require('underscore');
typeof __.each === 'function'

var sizeof = require('object-sizeof');

module.exports = function (key, org_db, new_db, callback) {

  AWS.config.update({accessKeyId: org_db.key, secretAccessKey: org_db.secret,
                     region: org_db.region} );
  var org_doc = new AWS.DynamoDB.DocumentClient();

  AWS.config.update({accessKeyId: new_db.key, secretAccessKey: new_db.secret,
                     region: new_db.region} );
  var new_doc = new AWS.DynamoDB.DocumentClient();


        Q.all([
          getItemFromtbl(new_doc, new_db.tbl, key),
          getItemFromtbl(org_doc, org_db.tbl, key)
          ])
          .then(function(dataArray){
              item_compare(key, dataArray[0], dataArray[1]);
          }, function(err){
           console.log(err);
          });



  function getItemFromtbl(_db, _tblName, _key, callback){
    var deferred = Q.defer();
    var params = {
      TableName: _tblName,
      Key:{
          "id": _key
      }
    };
    _db.get(params, function(err, data) {
      if (err) deferred.reject(err);
      else{
        deferred.resolve(data);
      }
    });
    return deferred.promise.nodeify(callback);
  };

  function item_compare(key, new_item, org_item){
     if (new_item.Item.content != null && org_item.Item.content !=null) {
         //console.time('timer');
       ju_comp.decompress(new_item.Item.content, function(err, result){
         //console.timeEnd('timer');
        if(__.isEqual(result, org_item.Item.content)){
          //console.log(key+":ok");
          console.log(key + "," + sizeof(new_item) + "," + sizeof(org_item));
        }else{
          console.log("error:" + key+",ng");
        }
      });

     }else {
       console.log("error:" + key+",empty");
     };

  }

};
