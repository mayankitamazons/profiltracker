var mysql = require('mysql');

// to save data
var con = mysql.createConnection({
  host: "profiletracker.cdiozl3hyrxl.ap-south-1.rds.amazonaws.com",
  user: "Pr0fileTrack0518",
  password: "Pr0fileTrAck3r0518",
  database:"profiletracker0518"
});
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT order_id,user_id,gems_key  from inapp_sale where user_id>500000", function (err, result, fields) {
    if (err) throw err;

    if (result.length>0) {    
          //console.log(result);
          // connect to mongodb database
         var MongoClient = require('mongodb').MongoClient;
         var url = "mongodb://13.232.61.198:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("profiletrackerdb");
  result.forEach(function(u) {
  var inappsale={
            order_id:u.order_id,
            user_id:u.user_id,
            gems_key:u.gems_key
    };
      //  console.log(udata);
        dbo.collection("inapp_sale").insertOne(inappsale, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");

        });

});
db.close();

});

    }
    else {
       console.log('No data found');
    }
  });
  con.end();
});
