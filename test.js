var another = require('./function.js');
const Tracker=require('./Model/tracker');
const express=require('express');
const mongoose=require('mongoose');
// body parser is use to process input to node
var bodyParser = require('body-parser');
// set up express app
var app = express();
// connect to mongodb database
mongoose.connect('mongodb://localhost/profiletrackerdb');
mongoose.Promise=global.Promise;

var purchase_data={
     package_name:"com.itamazon.profiletracker",
     gems_key:"all_strangers_new",
     token:"fnooodjjnompocbpfnelacfi.AO-J1Ozon5RyN0tGcnOMgHCStK1RSmoocUD2B-ybV6HI3FBiorabtS_Xv930ECqKUAN_AnRkMpnBr0cNX1ZoCoihruj55EEJnQV_5D0sZtSTQdN60o2HXTJGhGUdyWJ9yRxNtb7pRwvJ"
}
//var p=another.generateAccessToken(purchase_data);
var p=another.generateAccessToken(purchase_data, function(result){
       console.log(result.kind);
      if (result) {
          var purchaseState=result.purchaseState;
          var user_id="14404056826804263";
          if (purchaseState==0) {
            // valid inapp do needfull task
            inapp={
                order_id:purchase_data.order_id,
                gems_key:purchase_data.gems_key,
                signature:purchase_data.signature,
                token:purchase_data.token,
                purchaseTimeMillis:result.purchaseTimeMillis
            }
            Tracker.findByIdAndUpdate({_id:user_id},inapp).then(function(){
              //  res.send(ninja);
              Tracker.findOne({_id:user_id}).then(function(ninja){
                console.log(ninja);
               res.send(ninja);
              });
            });
          }else {
           // validation failed
          }
      }

        });
 console.log(p);
