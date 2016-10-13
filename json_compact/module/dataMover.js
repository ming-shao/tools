var AWS = require('aws-sdk');
var ju_comp = require('json-url');


module.exports = function (key, org_db, new_db, callback) {

  AWS.config.update({accessKeyId: org_db.key, secretAccessKey: org_db.secret,
                     region: org_db.region} );
  var org_doc = new AWS.DynamoDB.DocumentClient();

  AWS.config.update({accessKeyId: new_db.key, secretAccessKey: new_db.secret,
                     region: new_db.region} );
  var new_doc = new AWS.DynamoDB.DocumentClient();

  getItemByDocClient(org_doc, key, json_comp);


  function getItemByDocClient(_doc, _key, cb){
    var params = {
      TableName: org_db.tbl,
      Key:{
          "id": _key
      }
    };
    _doc.get(params, function(err, data) {
      //console.log(params);
      if (err) console.log(err);
      else{
        //console.log(data);
        //return data;
        cb(data);
      }
    });
  };


  function json_comp(data){
   ju_comp.compress(data.Item.content, function (err, result) {
   //console.log(result);
   data.Item.content=result;
   //console.log(data);
   putItemByDocClient(data);
   });
};


  function putItemByDocClient(data){
    var params = {
    TableName : new_db.tbl,
    Item: data.Item
    };

    new_doc.put(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
    });

};

};
