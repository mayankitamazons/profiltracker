  var request = require('request');
  const Tracker=require('./Model/tracker');
var methods = {};
var result;
methods.generateAccessToken = function(purchase_data,callback) {
//  console.log(purchase_data);

   var options = {
      url: 'https://accounts.google.com/o/oauth2/token',
      method: 'POST',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
     body: 'grant_type=refresh_token&refresh_token=1/wWSuaBkf0MuqOdhScmRL1Rb7XdvBRqV6BM48IXpXI8I&client_id=846046952462-o05ts5um6mb7ip1pdob6oif243c6l6ne.apps.googleusercontent.com&client_secret=MzDpg1GekWQKQRMvAi74xuOz',
   };

  request(options, function (error, response, body) {

    if(error) { return error;}
    var obj = JSON.parse(body);
    // callback(JSON.parse(body));
       if (obj.access_token) {
         var access_token=obj.access_token;
         // validate inapp purchase
         var validateurl="https://www.googleapis.com/androidpublisher/v2/applications/"+purchase_data.package_name+"/purchases/products/"+purchase_data.gems_key+"/tokens/"+purchase_data.token+"?access_token="+access_token;
         // console.log(validateurl);
         var options = {
             url:validateurl,
             method: 'GET',
             headers: {
                 "Accept": "application/json",
                 "Content-Type": "application/json"
             },

          };
          request(options, function (error, response,purchasebody) {

               callback(JSON.parse(purchasebody));

     
             });
       }
    });

};
methods.FriendData = function(user_data,callback) {
     var nodemailer = require('nodemailer');
   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'click4mayank@gmail.com',
        pass: 'Mayank@12'
      }
    });
   var tokendata=user_data.tokendata;
   if (tokendata) {
           var access_token=tokendata.access_token;
           if (tokendata.used_count) {
            var new_count=tokendata.used_count+1;
            }
         else {
            var new_count=1;
         }
           var id_str='';
            var d_ids=user_data.fb_id;
            var d_ids=d_ids.replace('NoData','00011817609506');
            var n = d_ids.startsWith(",");
            if (n) {
            var d_ids=d_ids.substr(1);
            }
            var ids=d_ids;
            var total_count=0;
            var str_array = d_ids.split(',');

            str_array.forEach(function(entry) {
                 var zerostart = entry.startsWith("00");
                 if (zerostart) {}
                 else {
                     if(total_count<49)
                   {
                       if ((entry.length)>9) {
                     id_str +=entry+',';
                   }

                   }  
                   
                   total_count++;


                 }
                  
                   
                             });
            //loop1:
            var url="https://graph.facebook.com/v2.8/?ids=["+id_str+"]&fields=id,name&access_token="+access_token;
            //console.log(url);
               request(url, { json: true }, (err, res2, body) => {
                   
                 if (err) {  callback({"status":false,"code":404,"message":"Error in Graph api"}); };
                 if (body.error) {
                   // console.log(body.error);
                         var text="version code: "+user_data.version+" for request "+user_data.fb_id+" with access token "+access_token+" reason "+body.error.message;
               var mailOptions = {
                 from: 'click4mayank@gmail.com',
                 to: 'click4mayank@gmail.com,ntngupta600@gmail.com',
                   subject: body.error.message,
                 text: text
               };
                         transporter.sendMail(mailOptions, function(error, info){
                          if (error) {
                            console.log(error);
                          } else {
                            console.log('Email sent: ' + info.response);
                          }
                        });
                          callback({"status":false,"code":404,"message":body.error.message});
                         Tracker.updateOne(
                                       { "access_token":access_token},
                                         {"used_count":new_count,"usable":"n"},
                                          function(err, result){
                                           //  console.log(result);
                                           if (err) { }
                                          }
                                       )
                              // get next access token to 
                         }else {
                           Tracker.updateOne(
                                       { "access_token":access_token},
                                         {"used_count":new_count,"usable":"y"},
                                          function(err, result){
                                           //  console.log(result);
                                           if (err) { }
                                          }
                                       )
                           callback({"status":true,"code":200,"message":"Data listed Successfully","data":body});
                         
                       }
               });
       }else {
            res.send({"status":false,"code":404,"message":"No Access token found"});
       }

};

module.exports = methods;
