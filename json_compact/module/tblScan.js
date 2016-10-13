var AWS = require('aws-sdk');

module.exports = function (db, tbl, cb) {
    AWS.config.update({accessKeyId: db.key,
    　　　　　　　　　　secretAccessKey: db.secret,
                     region: 'ap-northeast-1'} );
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {TableName: tbl,};
    var itemList = [];

    docClient.scan(params, onScan);

    function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        //console.log("Scan succeeded.");

        data.Items.forEach(function(item){
            //console.log(item.id);
            itemList.push(item);
            //console.log(array);
         });

        // continue scanning if we have more movies
        if (typeof data.LastEvaluatedKey != "undefined") {
            //console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        } else {
          //console.log("Finished");
          cb(itemList);
        }
    }
    };

};
