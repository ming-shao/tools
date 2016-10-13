var AWS = require('aws-sdk');
var ju_comp = require('json-url');
var Q = require('q');
var __ = require('underscore');
typeof __.each === 'function'


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
              s_content_compare(key, dataArray[0].Item.content, dataArray[1].Item.content);
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

  function s_content_compare(key, b64, org){
     if (b64 != null && org !=null) {
         //console.time('timer');
       ju_comp.decompress(b64, function(err, result){
         //console.timeEnd('timer');
        if(__.isEqual(result, org)){
          console.log(key+":ok");
        }else{
          console.log(key+":ng");
          //console.log(org);
        }
      });


     }else {
       console.log(key+":empty");
     };

  }

};
