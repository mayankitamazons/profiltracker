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
  con.query("SELECT  users.id,users.name,users.fb_id,users.cover_pic,users.email,users.app_ver,users.show_rating,users.show_sharing,users.show_ads,users.access_token,users.fcm_id FROM users where users.id='667770' order by id desc  LIMIT 0,1", function (err, result, fields) {
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
  var udata={
            user_id:u.id,
            name:u.name,
            email:u.email,
            fb_id:u.fb_id,
            _id:u.fb_id,
            fcm_id:u.fcm_id,
            cover_pic:u.cover_pic,
            access_token:u.access_token,
            app_ver:u.app_ver,
            show_rating:u.show_rating,
            show_ads:u.show_ads,
            show_sharing:u.show_sharing,
            inapp :[], 
    };
      //  console.log(udata);
        dbo.collection("users").insertOne(udata, function(err, res) {
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
