const express=require('express');
const request=require('request');
var extrafunction = require('../function.js');

// to save data
const Tracker=require('../Model/tracker');
 const InappModel=require('../Model/inapp');

const router=express.Router();
// loginsocial api
// post  request  to login  register new user
router.post('/loginsocial',function(req,res,next){
//  console.log(req.body);
  var data=req.body.data;
  if(data.fb_id)
  {


  // Yes, it's a valid ObjectId, proceed with `findById` call.
  Tracker.findOne({fb_id:req.body.data.fb_id}).then(function(userdata){
     //console.log(userdata.name);
    if (userdata) {
    var user_id=userdata._id;
  //  var userdata = userdata.toObject();
  //  userdata.fb_id =user_id;
  if(user_id)
  {
    res.send({ "status": true,"message": "Login Successfully","code": 200,"data":userdata,"isNewUser": false,"show_ads":userdata.show_ads});
  }

}
else {

  // register
    var access_token=data.access_token;
  //  console.log(access_token);
    if(access_token)
    {

      var url="https://graph.facebook.com/v2.8/me?fields=picture,cover,id,name,email&access_token="+access_token;
    //  console.log(url);
      request(url, { json: true }, (err, res2, body) => {
      if (err) { return console.log(err); }
      //var usercount=usercount();
    //  console.log(body);
     if (body.error) {
         console.log('error on access token');
        // var body={ name:'', email:'' };
        }
     //console.log(body);

      var tdata= Tracker.findOne().sort({user_id:-1}).select({_id:1,user_id:1}).then(function(tdata){
    // var countuser=1;
      //  console.log(tdata);
    //  return false;
     if (tdata) {
       var countuser=tdata.user_id+1;
     }else {
       var countuser=1;
     }

       if (countuser=='') {
           var countuser=1;
       }
       if (body.error) {
          var cover_pic='';
          }
       else {
           var cover_pic=body.picture.data.url;
       }
       var cover_pic="http://graph.facebook.com/"+body.id+"/picture?type=large";
          var udata={
                  user_id:countuser,
                  name:body.name,
                  show_ads:"n",
                  email:body.email,
                  fb_id:data.fb_id,
                  social_id:body.id,
                  _id:countuser,
                  fcm_id:data.fcm_id,
                  cover_pic:cover_pic,
                  access_token:access_token,
                  app_ver:req.body.version

              };
          //    console.log(udata);
            //  res.send(udata);
          //   return false;
              // save new user
              Tracker.create(udata).then(function(ninja){
              //  console.log(ninja);
              if (ninja) {
                   res.send({ "status": true,"message": "New User Register  Successfully","code": 200,"data":ninja,"isNewUser": true,"show_ads": "y"});
              }
              else {

              res.send({"status":false,"code":404,"message":"Something Went Wrong","show_ads":'n'});
              }

             }).catch(next);

    });



      });
    }
}
}).catch(next);



  }
  else {
    res.send({"status":false,"code":404,"message":"fb_id is missing","show_ads":'n'});

  }
  //Tracker.create(req.body).then(function(ninja){
  //res.send(ninja);
// }).catch(next);

});
router.post('/useractiveplan',function(req,res,next){
  var data=req.body.data;
  var user_id=data.user_id;
  var via="andriod";
  var via=req.body.via;
  if (user_id) {
             Tracker.findOne({user_id:user_id}).then(function(record){
              // console.log(record.show_sharing);
              // return false;
                if (record) {
                        if(via=="ios")
                          {
                             var friends=[];
                          var stranger=[];
                          }
                          else
                          {
                             var friends='';
                          var stranger='';
                          }

                          var inappplan={};
                          var activeplan=[];
                          var gemsarray=[];
                        if(record.show_rating=="show")
                        {
                          var show_rating="y";
                        }else {
                          var show_rating=record.show_rating;
                        }
                        if (record.show_sharing=="show") {
                            var show_sharing="y";
                        } else {
                            var show_sharing=record.show_sharing;
                        }


                        //console.log(record.inapp);
                         var inappcount=(record.inapp).length;
                         if (inappcount>0) {
                           record.inapp.forEach(function(value){
                              gems_key=value.gems_key;
                              gemsarray.push(gems_key);
                             });
                             // check all friends
                             if ((gemsarray.indexOf("all_friends") > -1) || (gemsarray.indexOf("all_users") > -1)) {
                                  var friends="all_friends";
                              } else if ((gemsarray.indexOf("top_100") > -1)) {
                                var friends="top_100";
                              } else if ((gemsarray.indexOf("top_50") > -1)) {
                                var friends="top_50";
                              } else if ((gemsarray.indexOf("top_25") > -1)) {
                                var friends="top_25";
                              } else if ((gemsarray.indexOf("top_10") > -1)) {
                                var friends="top_10";
                              }
                             // check all stranger
                             if ((gemsarray.indexOf("all_strangers_new") > -1) || (gemsarray.indexOf("all_strangers") > -1)) {
                                  var stranger="all_strangers_new";
                              } else if ((gemsarray.indexOf("top_50_strangers") > -1)) {
                                var stranger="top_50_strangers";
                              } else if ((gemsarray.indexOf("top_25_strangers") > -1)) {
                                var stranger="top_25_strangers";
                              } else if ((gemsarray.indexOf("top_10_strangers") > -1)) {
                                var stranger="top_10_strangers";
                              }
                              inappplan.stranger_plan=stranger;
                              inappplan.friend_plan=friends;
                         }
                        else {
                          if(via=="ios")
                          {
                              inappplan.stranger_plan=[];
                            inappplan.friend_plan=[];
                          }
                          else
                          {
                             inappplan.stranger_plan='';
                            inappplan.friend_plan='';

                          }

                        }

                        var resdata={
                          show_rating:show_rating,
                          show_sharing:show_sharing,
                          show_ads:record.show_ads,
                          stranger_url:"https://www.facebook.com/friends/center/",
                        //  stranger_url:"https://www.facebook.com/friends/requests/?split=1&fcref=ft",
                          inapp:inappplan

                        };
                         res.send({"status":true,"code":200,"message":"Data found","data":resdata,"access_token":''});

                }
                else {
                       res.send({"status":false,"code":404,"message":"No Record Found for selected user","show_ads":'n'});
                }
             });
  }else {

    res.send({"status":false,"code":404,"message":"Required  Paramter is missing","show_ads":'n'});
  }
});
router.post('/useractiveplanios',function(req,res,next){
  var data=req.body.data;
  var user_id=data.user_id;
  var via="andriod";
  var via=req.body.via;
  if (user_id) {
             Tracker.findOne({user_id:user_id}).then(function(record){
                if(record)
                {
                      var inappplan={};
                      var activeplan=[];
                      var gemsarray=[];
                       if(record.show_rating=="show")
                        {
                          var show_rating="y";
                        }else {
                          var show_rating=record.show_rating;
                        }
                        if (record.show_sharing=="show") {
                            var show_sharing="y";
                        } else {
                            var show_sharing=record.show_sharing;
                        }
                         var resdata={
                          show_rating:show_rating,
                          show_sharing:show_sharing,
                          show_ads:record.show_ads,
                          stranger_url:"https://www.facebook.com/friends/center/",
                        //  stranger_url:"https://www.facebook.com/friends/requests/?split=1&fcref=ft",
                          inapp:record.inapp

                        };
                         res.send({"status":true,"code":200,"message":"Data found","data":resdata,"access_token":''});
                }
                else
                {
                   res.send({"status":false,"code":404,"message":"No User id found"});
                }
              });
           }
  });
router.post('/inappios',function(req,res,next){
   var userId=req.body.data.user_id;
   var data=req.body.data;
  if (userId) {
    Tracker.findOne({user_id:userId}).then(function(record){
        if (data.gems_key=="remove_ads") {
                 Tracker.updateOne(
                        { "user_id":userId},
                          {"show_ads":"n"},
                          function(err, result){
                            //  console.log(result);
                            if (err) {
                              res.send({"status":false,"code":404,"message":"Something Went Wrong"});
                            }
                            res.send({"status":true,"code":200,"message":"Inapp Done Successfully","show_ads":'n'});
                          }
                      )
               }
                 else {
                 // add a inapp sale
                 var inapp_sale={
                   order_id:"iosorder",
                   gems_key:data.purchase_data.gems_key
                 };
                 Tracker.updateOne(
                        { "user_id":userId},
                          { "$push": { "inapp": inapp_sale } },
                          function(err, result){
                            //  console.log(result);
                            if (err) {
                              res.send({"status":false,"code":404,"message":"Something Went Wrong"});
                            }
                            res.send({"status":true,"code":200,"message":"Inapp Done Successfully","show_ads":'n'});
                          }
                      )
               }
    });
  }
  else
  {
     res.send({"status":false,"code":404,"message":"Wrong","show_ads":'n'});
  }
  });
router.post('/inappnew',function(req,res,next){
  var data=req.body.data.purchase_data;
  var purchase_data={
       package_name:data.package_name,
       gems_key:data.gems_key,
       token:data.token,
       signature:data.signature,
       order_id:data.order_id,
       purchaseTimeMillis:''
  };
  var userId=req.body.data.user_id;
  if (userId) {
    Tracker.findOne({user_id:userId}).then(function(record){
        extrafunction.generateAccessToken(purchase_data, function(result){
           // wait untill result from access token function
           if (result) {
              var purchaseState=result.purchaseState;
            //var purchaseState=0;
             if (purchaseState==0) {

               // valid inapp do needfull task
            //   purchase_data.purchaseTimeMillis=result.purchaseTimeMillis;
            // remove ads
               if (data.gems_key=="remove_ads") {
                 Tracker.updateOne(
                        { "user_id":userId},
                          {"show_ads":"n"},
                          function(err, result){
                            //  console.log(result);
                            if (err) {
                              res.send({"status":false,"code":404,"message":"Something Went Wrong"});
                            }
                            res.send({"status":true,"code":200,"message":"Inapp Done Successfully","show_ads":'n'});
                          }
                      )
               }
               else {
                 // add a inapp sale
                 var inapp_sale={
                   order_id:data.order_id,
                   gems_key:data.gems_key
                 };
                 Tracker.updateOne(
                        { "user_id":userId},
                          { "$push": { "inapp": inapp_sale } },
                          function(err, result){
                            //  console.log(result);
                            if (err) {
                              res.send({"status":false,"code":404,"message":"Something Went Wrong"});
                            }
                            res.send({"status":true,"code":200,"message":"Inapp Done Successfully","show_ads":'n'});
                          }
                      )
               }

              //  record.inapp.push(inapp_sale);
              //  record.save().then(function(){
              //  res.send({"status":true,"code":200,"message":"Inapp Done Successfully","show_ads":'n'});
              //  });
             }
             else {
                 res.send({"status":false,"code":404,"message":"Invalid Purchase"});
             }
           }
           else {
                 res.send({"status":false,"code":404,"message":"Token Validation Error"});
           }
        });
      });

  }
  else {
      res.send({"status":false,"code":404,"message":"Required  Paramter is missing","show_ads":'n'});
  }
});
router.post('/inappnewdemo',function(req,res,next){
  var data=req.body.data.purchase_data;
  var purchase_data={
       package_name:data.package_name,
       gems_key:data.gems_key,
       token:data.token,
       signature:data.signature,
       order_id:data.order_id,
       purchaseTimeMillis:''
  };
  var userId=req.body.data.user_id;
  if (userId) {
    Tracker.findOne({user_id:userId}).then(function(record){
        extrafunction.generateAccessToken(purchase_data, function(result){
           // wait untill result from access token function
           if (result) {
              var purchaseState=result.purchaseState;
            var purchaseState=0;
             if (purchaseState==0) {

               // valid inapp do needfull task
            //   purchase_data.purchaseTimeMillis=result.purchaseTimeMillis;
            // remove ads
               if (data.gems_key=="remove_ads") {
                 Tracker.updateOne(
                        { "user_id":userId},
                          {"show_ads":"n"},
                          function(err, result){
                            //  console.log(result);
                            if (err) {
                              res.send({"status":false,"code":404,"message":"Something Went Wrong"});
                            }
                            res.send({"status":true,"code":200,"message":"Inapp Done Successfully","show_ads":'n'});
                          }
                      )
               }
               else {
                 // add a inapp sale
                 var inapp_sale={
                   order_id:data.order_id,
                   gems_key:data.gems_key
                 };
                 Tracker.updateOne(
                        { "user_id":userId},
                          { "$push": { "inapp": inapp_sale } },
                          function(err, result){
                            //  console.log(result);
                            if (err) {
                              res.send({"status":false,"code":404,"message":"Something Went Wrong"});
                            }
                            res.send({"status":true,"code":200,"message":"Inapp Done Successfully","show_ads":'n'});
                          }
                      )
               }

              //  record.inapp.push(inapp_sale);
              //  record.save().then(function(){
              //  res.send({"status":true,"code":200,"message":"Inapp Done Successfully","show_ads":'n'});
              //  });
             }
             else {
                 res.send({"status":false,"code":404,"message":"Invalid Purchase"});
             }
           }
           else {
                 res.send({"status":false,"code":404,"message":"Token Validation Error"});
           }
        });
      });

  }
  else {
      res.send({"status":false,"code":404,"message":"Required  Paramter is missing","show_ads":'n'});
  }
});
router.post('/fbdata',function(req,res,next){
    Tracker.findOne({access_token:{$ne:''}}).sort({user_id:-1}).select({_id:1,access_token:1}).then(function(tokendata){
       if (tokendata) {
           var access_token=tokendata.access_token;
          //var access_token="EAACEdEose0cBABfnsg65ZBvVTZB1uezxq6oYebab6LZCboqwTRJQz1y8ZCgeeRAkyLrNiwa3Tjq0o8Rxal8mMtQf9LACyyD2EsZCH797YZAvXLCpaSyRdsx9NMacbGSW35aGn86NDAAuLkBv9YdUbr9xs3kUtUzmmF6LLDWAqkgLAugyiYy9dLrFxzE9NaRZBIZD";
             var url="https://graph.facebook.com/v2.8/me?fields=id,name&access_token="+access_token;
           request(url, { json: true }, (err, res2, body) => {
           if (err) { res.send({"status":false,"code":404,"message":"Error in Graph api"}); }
           if (body.error) {  res.send({"status":false,"code":404,"message":"Body data missing"}); }else {
             res.send({"code":200,"status":true,"name":body.name,"id":body.id,"message":"Data listed Successfully"});
           }

         });
       }else {
            res.send({"status":false,"code":404,"message":"No Access token found"});
       }
  });
});
router.post('/fbtest',function(req,res,next){
  var reqdata=req.body.data.fb_id;
  var access_token=req.body.data.access_token;
   var nodemailer = require('nodemailer');
   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'click4mayank@gmail.com',
        pass: 'Mayank@12'
      }
    });


    Tracker.findOne({access_token:{$ne:''}}).sort({user_id:-1}).select({_id:1,access_token:1}).then(function(tokendata){
       if (tokendata) {
         //var access_token=tokendata.access_token;
        var id_str='';
         var d_ids=req.body.data.fb_id;
         var d_ids=d_ids.replace('NoData','00011817609506');
         var n = d_ids.startsWith(",");
         if (n) {
         var d_ids=d_ids.substr(1);
         }
        var ids=d_ids;
          var str_array = d_ids.split(',');
          str_array.forEach(function(entry) {
              var zerostart = entry.startsWith("00");
              if (zerostart) {

              }
              else {
                if ((entry.length)>9) {
                  id_str +=entry+',';
                }

              }
        });
      //  res.send(id_str);


        //  var access_token="EAALUiqfhDHUBAHANmPk34TWrgn0TGUZABtZClbjCcKP5E6RL0TLCibGKB2lAEcWO7L23AA6ERsl5goaLI3EyqKjYZBGvSRQF1ijLIpZCZCxDsZBEkaYlVtOlZAH8YiDIPxexuKZBdgtJDETEOIC9ZBFwJkAS75KRSu1uaimZCNewwQDZAP6SnZAHELNsnPu7sJ34PQXAJNbQnkiZCqax1JFwiYpMq7Uywu19LOIMZD";
             var url="https://graph.facebook.com/v2.3/?ids=["+id_str+"]&fields=id,name&access_token="+access_token;
             var text="For test version code: "+req.body.version+" for request "+reqdata+" with access token "+access_token+" Url "+url;
               var mailOptions = {
                 from: 'youremail@gmail.com',
                 to: 'click4mayank@gmail.com,ntngupta600@gmail.com',
                 subject: 'Test Access token expire',
                 text: text
               };
           request(url, { json: true }, (err, res2, body) => {
             //console.log(body);

           if (err) { res.send({"status":false,"code":404,"message":"Error in Graph api"}); }
           if (body.error) {
             res.send({"status":false,"code":404,"message":body.error});
             transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });

             }else {
             res.send({"code":200,"status":true,"data":body,"message":"Data listed Successfully"});
           }

         });
       }else {
            res.send({"status":false,"code":404,"message":"No Access token found"});
       }
  });
});
router.post('/fbdatabulk2',function(req,res,next){
  var reqdata=req.body.data.fb_id;
  var data=req.body.data;
    var app_ver=req.body.version;
   var nodemailer = require('nodemailer');
   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'click4mayank@gmail.com',
        pass: 'Mayank@12'
      }
    });
    var access_token="EAAWGNksvUe0BAAXKcuqj63HKTGXluzqL71OS8P2iPs5A7N9NeQBKnPITMF8vCpGVJiFnwv5GOneCuDkIXFmDGcy0hpwXKWUn5GLGzMWoJ3Sh8wIi6V758oy7eO4QnbNeYsd3dU4oHBOo7bZBJko45VMaEKImNu39Rv2DwtkSaT86vrQXjdLfZApHDDnsssUqop6h6zNQZDZD";
    var id_str='';
    var d_ids=data.fb_id;
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
      var url="https://graph.facebook.com/v2.8/?ids=["+id_str+"]&fields=id,name&access_token="+access_token;

               request(url, { json: true }, (err, res2, body) => {
                    if (err) {  callback({"status":false,"code":404,"message":"Error in Graph api"}); };
                 if (body.error) {
                   // console.log(body.error);
                         var text="version code: "+req.body.version+" for request "+data.fb_id+" with access token "+access_token+" reason "+body.error.message;
               var mailOptions = {
                 from: 'click4mayank@gmail.com',
                 to: 'click4mayank@gmail.com,ntngupta600@gmail.com',
                   subject: body.error.message,
                 text: text
               };
                         transporter.sendMail(mailOptions, function(error, info){
                          if (error) {
                           // console.log(error);
                          } else {
                           // console.log('Email sent: ' + info.response);
                          }
                        });

                           res.send({"status":false,"code":404,"message":body.error.message});

                              // get next access token to
                         }else {

                           res.send({"status":true,"code":200,"message":"Data List Successfully","data":body});

                       }
                   });

 });
router.post('/fbdatabulktest',function(req,res,next){
  var reqdata=req.body.data.fb_id;
    var app_ver=req.body.version;
   var nodemailer = require('nodemailer');
   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'click4mayank@gmail.com',
        pass: 'Mayank@12'
      }
    });


        Tracker.findOne({access_token:{$ne:''}}).sort({user_id:-1}).select({_id:1,access_token:1,used_count:1}).then(function(tokendata){
       if (tokendata) {
           var access_token=tokendata.access_token;
           if (tokendata.used_count) {
            var new_count=tokendata.used_count+1;
         }
         else {
            var new_count=1;
         }
           var id_str='';
            var d_ids=req.body.data.fb_id;
            var d_ids=d_ids.replace('NoData','00011817609506');
            var n = d_ids.startsWith(",");
            if (n) {
            var d_ids=d_ids.substr(1);
            }
           var ids=d_ids;
             var str_array = d_ids.split(',');
             str_array.forEach(function(entry) {
                 var zerostart = entry.startsWith("00");
                 if (zerostart) {

                 }
                 else {
                   if ((entry.length)>9) {
                     id_str +=entry+',';
                   }

                 }
           });
          // var ids=req.body.data.fb_id;
      //  var access_token="EAAcZB5ZB9FeZBcBAH5nCAu6GyIClZByqmqYp2XXtvzL8Dy0NpUGpzWO0lBSdeRP2guDgb2Yfqv8i5DYiRl5yqvEW6VDaSuKlpLDEgC7a7nrPPN4UMsYM17pB6HdjVl4K4yBZBZBHeagviiJhlnzUaAvVEfDUErrsQhO6OVkj0WMOPdyzgSne1FGSP5rNIkNeYZD";
             var url="https://graph.facebook.com/v2.8/?ids=["+id_str+"]&fields=id,name&access_token="+access_token;
             var text="version code: "+req.body.version+" for request "+reqdata+" with access token "+access_token;
               var mailOptions = {
                 from: 'youremail@gmail.com',
                 to: 'click4mayank@gmail.com,ntngupta600@gmail.com',
                 subject: 'Access token expire',
                 text: text
               };
           request(url, { json: true }, (err, res2, body) => {
             //console.log(body);
             Tracker.updateOne(
           { "access_token":access_token},
             {"used_count":new_count},
             function(err, result){
               //  console.log(result);
               if (err) {

               }

             }
         )
           if (err) { res.send({"status":false,"code":404,"message":"Error in Graph api"}); }
           if (body.error) {
             transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
              res.send({"status":false,"code":404,"message":body.error});
             }else {
             res.send({"code":200,"status":true,"data":body,"message":"Data listed Successfully"});
           }

         });
       }else {
            res.send({"status":false,"code":404,"message":"No Access token found"});
       }
  });
});
router.post('/fbdatabulk',function(req,res,next){
   var nodemailer = require('nodemailer');
   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'click4mayank@gmail.com',
        pass: 'Mayank@12'
      }
    });
    const FbTable=require('../Model/tokenfb');
    FbTable.findOne({access_token:{$ne:''}}).then(function(tokendata){
      //   res.send({"status":true,"code":404,"message":tokendata});
      var Fdata={
          tokendata:tokendata,
          fb_id:req.body.data.fb_id,
          version:req.body.version,
          data:req.body.data
      };
      extrafunction.FriendData(Fdata, function(result){
        var status=result.status;
        if(status==true)
        {
             res.send({"status":true,"code":200,"message":"Data List Successfully","data":result.data,"token_user_id":tokendata.user_id});
        }
        else
        {
           // continue start;
            Tracker.findOne({access_token:{$ne:''}}).sort({user_id:-1}).select({_id:1,access_token:1,used_count:1}).then(function(tokendata){
                var Fdata={
                    tokendata:tokendata,
                    fb_id:req.body.data.fb_id,
                    version:req.body.version,
                    data:req.body.data
                };
                 extrafunction.FriendData(Fdata, function(result){
                  var status=result.status;
                  if(status==true)
                  {
                       res.send({"status":true,"code":200,"message":"Data List Successfully","data":result.data,"token_user_id":tokendata.user_id});
                  }
                  else
                  {
                     res.send({"status":false,"code":404,"message":result.message,"token_user_id":tokendata.user_id});
                  }
                });
              });

        }

     });



    });

});
router.post('/fbdatabulknew',function(req,res,next){
  var reqdata=req.body.data.fb_id;
    var app_ver=req.body.version;
   var nodemailer = require('nodemailer');
   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'click4mayank@gmail.com',
        pass: 'Mayank@12'
      }
    });
  // start:
    if((app_ver=="45") || (app_ver=="52"))
    {
        Tracker.findOne({access_token:{$ne:''},app_ver:"45",used_count:{$lt:3}}).sort({user_id:-1}).select({user_id:1,_id:1,access_token:1,used_count:1}).then(function(tokendata){
              var Fdata={
                  tokendata:tokendata,
                  fb_id:req.body.data.fb_id,
                  version:req.body.version,
                  data:req.body.data
              };
              extrafunction.FriendData(Fdata, function(result){
                var status=result.status;
                if(status==true)
                {
                     res.send({"status":true,"code":200,"message":"Data List Successfully","data":result.data,"token_user_id":tokendata.user_id});
                }
                else
                {
                   // continue start;
                    Tracker.findOne({access_token:{$ne:''}}).sort({user_id:-1}).select({_id:1,access_token:1,used_count:1}).then(function(tokendata){
                        var Fdata={
                            tokendata:tokendata,
                            fb_id:req.body.data.fb_id,
                            version:req.body.version,
                            data:req.body.data
                        };
                         extrafunction.FriendData(Fdata, function(result){
                          var status=result.status;
                          if(status==true)
                          {
                               res.send({"status":true,"code":200,"message":"Data List Successfully","data":result.data,"token_user_id":tokendata.user_id});
                          }
                          else
                          {
                             res.send({"status":false,"code":404,"message":result.message,"token_user_id":tokendata.user_id});
                          }
                        });
                      });

                }

             });

        });
    }
    else
    {
      Tracker.findOne({access_token:{$ne:''},user_id:{$gt:651056},used_count:{$lt:3},app_ver:{$ne:"45"}}).sort({user_id:1}).select({user_id:1,_id:1,access_token:1,used_count:1}).then(function(tokendata){

              var Fdata={
                  tokendata:tokendata,
                  fb_id:req.body.data.fb_id,
                  version:req.body.version,
                  data:req.body.data
              };
              extrafunction.FriendData(Fdata, function(result){
                var status=result.status;
                if(status==true)
                {
                     res.send({"status":true,"code":200,"message":"Data List Successfully","data":result.data,"token_user_id":tokendata.user_id});
                }
                else
                {
                      // continue start;
                    Tracker.findOne({access_token:{$ne:''}}).sort({user_id:-1}).select({_id:1,access_token:1,used_count:1}).then(function(tokendata){
                        var Fdata={
                            tokendata:tokendata,
                            fb_id:req.body.data.fb_id,
                            version:req.body.version,
                            data:req.body.data
                        };
                         extrafunction.FriendData(Fdata, function(result){
                          var status=result.status;
                          if(status==true)
                          {
                               res.send({"status":true,"code":200,"message":"Data List Successfully","data":result.data,"token_user_id":tokendata.user_id});
                          }
                          else
                          {
                             res.send({"status":false,"code":404,"message":result.message,"token_user_id":tokendata.user_id});
                          }
                        });
                      });
                }

             });

        });
    }
});


router.post('/moreapp',function(req,res,next){
  var str= [
    {
        "app_id": 2,
        "app_name": "AV MP-3 Player",
        "app_desc": "AV MP-3 Player is one of the best app for music and audio player for Android By using AV MP-3 Player, you can listen to all audio file types. Play your favorite music mp3 and others files!",
        "icon": "https://lh3.googleusercontent.com/Cdcb8wlYsdTlWDPGOvGi1L5I26qojdOSJeh_9dq5mCraBZ__XprUFwMcGlAwiaIVrM8a=s180",
        "url": "http://onelink.to/tyu4c7"
    },
   {
            "app_id": 5,
            "app_name": "Whatapp Story Saver",
            "app_desc": "Loved a friend's WhatsApp’s status? Well, You are at Right App\nCurrently on Whatsapp’s you can only view your friend’s status (image or video), but if you want to save it for your use there is no option. Don’t worry this app will solve your problem.\nWith Whatsapp's new status feature, all status automatically disappear after 24 hours. So with our app you can save your favorite status and can access them anytime.",
            "icon": "https://firebasestorage.googleapis.com/v0/b/profiletracker-ef459.appspot.com/o/img%2Fmoreapp%2Fwhatstory.png?alt=media&token=260baa2f-05f6-4ee0-968f-cd4c9e22cf05",
            "url": "https://play.google.com/store/apps/details?id=com.itamazon.whatsstoriessaver"
        },


    {
        "app_id": 3,
        "app_name": "Whats Tracker",
        "app_desc": "A perfect useful platform where you can track a user who visits your WhatsApp profile. You can also track your WhatsApp contact's location on map. Now no more hidden visitors you can know details about all the visitors and their location too.",
        "icon": "https://firebasestorage.googleapis.com/v0/b/profiletracker-ef459.appspot.com/o/img%2Fmoreapp%2Fwhatstrack.png?alt=media&token=fd7247a9-4177-4383-bb22-89dcbdcfbd3c",
        "url": "https://play.google.com/store/apps/details?id=com.whatstracker.app"
    },
        {
            "app_id": 4,
            "app_name": "WT chat",
            "app_desc": "Join the perfect Social chatting app! Chat with new people.Chat with people around you. WT Chat is the best social and chatting app to meet new people around you. Simply like or pass on the other people. WT Chat helps you find new people nearby who share your interests and want to chat now! It’s fun, friendly, and free!Main feature of WT Chat app is that you can also check your profile visitor who check your profile in WT Chat app.",
            "icon": "https://firebasestorage.googleapis.com/v0/b/profiletracker-ef459.appspot.com/o/img%2Fmoreapp%2Fwtchat.png?alt=media&token=166cf058-06e6-46c6-9a56-a0ddce19f5f6",
            "url": "http://onelink.to/7tc8mn"
        },


        {
            "app_id": 6,
            "app_name": "Postrunner for Instagram",
            "app_desc": "1. Get Readymade Post with Image, Captions and Hashtags.\r\n2. Automatically get hashtags and captions of your photo \r\n3. Get millions of Images to post from.",
            "icon": "https://firebasestorage.googleapis.com/v0/b/profiletracker-ef459.appspot.com/o/img%2Fmoreapp%2FPostrunner.jpg?alt=media&token=2f4e1831-b551-4099-922d-4919652ee3a6",
            "url": "http://onelink.to/4k72hz"
        },
        {
            "app_id": 7,
            "app_name": "FIRE RIDE",
            "app_desc":"Swing the Fireball through the geometric cave and hit the portals. Keep the fire burning !One-tap easy-to-learn controls, rich visual effects and addictive game-play mechanics",
            "icon": "https://lh3.googleusercontent.com/hXCvLE0ga046ZzJYy1lQV_simkoVWwdqHZmeWF5lAr2i78TstJ51HjwJs4BYZkZ4Hogz=s180",
            "url": "http://onelink.to/afhc23"
        }
    ];
    res.send({"code":200,"status":true,"data":str,"message":"Data listed Successfully"});
});
router.post('/updateaccesstoken',function(req,res,next){
    //  const FbTable=require('../Model/fbtoken');
      const FbTable=require('../Model/tokenfb');
      var access_token=req.body.access_token;
    //  console.log(access_token);
    FbTable.updateOne(
             {access_token:access_token},
               function(err, result){
                 //  console.log(result);
                 if (err) {
   					 res.send({"code":404,"status":false,"message":"Failed Try Again"});
                 }
                 else
                 {
                 	   res.send({"code":200,"status":true,"message":"Data listed Successfully"});
                 }

               }
           )


});
router.post('/inappswap',function(req,res,next){
  var MongoClient = require('mongodb').MongoClient;
   var url = "mongodb://13.232.61.198:27017/";

MongoClient.connect(url, function(err, db) {
if (err) throw err;
var dbo = db.db("profiletrackerdb");
//var query = {_id:19700};
dbo.collection("inapp_sale").find().toArray(function(err, result) {
if (err) throw err;

      result.forEach(function(indata) {
            var newdata={

              order_id:indata.order_id,
              gems_key:indata.gems_key
            };
            var userId=indata.user_id;
            console.log(userId);
            Tracker.findOne({user_id:userId}).then(function(userdata){
               //console.log(newdata);
              // return false;
                 if (userdata) {
                   Tracker.updateOne(
                     { "user_id":userId},
                       { "$push": { "inapp": newdata } },
                       function(err, result){
                         //  console.log(result);
                         if (err) {
                           var msg="failed data: "+userId;
                           console.log(msg);
                         }
                         var msg="inapp updated for : "+userId;
                         console.log(msg);
                       }
                   )

                 }

                });
        });
db.close();
});
});

  });
function usercount()
{
  var tdata=Tracker.find().count().then(function(tdata){
  //  console.log(tdata);
  return tdata;

});
}


module.exports=router;
