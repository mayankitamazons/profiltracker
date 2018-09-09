var mongoose=require('mongoose');
var schema=mongoose.Schema;
// create inapp Schema
var InappSchema=new schema({
      _id: mongoose.Schema.ObjectId,
       order_id:{
      type:String
    },
    user_id:{
   type:Number
 },
    gems_key:{
      type:String
    }



});
var InappModel=mongoose.model('inapp_sale',InappSchema);
module.exports=InappModel;
