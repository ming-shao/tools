var myModule = require('./module');
const cfg = require('./config');


// AWS.config.update({accessKeyId: cfg.dynamo_cms.key,
//   　　　　　　　　　　secretAccessKey: cfg.dynamo_cms.secret,
//                    region: 'ap-northeast-1'} );

//var tblName_sandbox = 'cms_pub_test';
//var talName_cms = 'stg01-integrate_globalcms_cms_publicationRecords';


myModule.scanner(cfg.dynamo_cms, cfg.dynamo_cms.tbl, function(items) {
    items.forEach(function(i) {
      //console.log(i.id);
     // myModule.dataMover(i.id, cfg.dynamo_cms, cfg.dynamo_sandbox);
      myModule.dataCompare(i.id, cfg.dynamo_cms, cfg.dynamo_sandbox);
    })
});
