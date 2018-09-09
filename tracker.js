var mongoose=require('mongoose');
var schema=mongoose.Schema;
// create inapp Schema
var InappSchema=new schema({
      _id: mongoose.Schema.ObjectId,
       order_id:{
      type:String
    },

    gems_key:{
      type:String
    }



})
// create user default Schema
var UserSchema=new schema({
  // _id:mongoose.Types.ObjectId,
  _id:{
    type:String
  },
  user_id:{
    type:Number
  },
  fb_id:{
    type:String
  },
  name:{
    type:String
   },
  cover_pic:{
    type:String
  },
  email:{
    type:String
  },
    app_ver:{
      type:String
    },
   show_rating:{
    type: String,
    enum: ['y', 'n'],
    default:'y'
  },
  show_sharing:{
   type: String,
   enum: ['y', 'n'],
   default:'y'
 },
show_ads:{
  type: String,
  enum: ['y', 'n'],
  default:'y'
},
access_token:{
 type: String,
},
fcm_id:{
 type: String,
},
created_utc:{
 type: String,
},
 inapp: [InappSchema]
});
var User=mongoose.model('user',UserSchema);
module.exports=User;
