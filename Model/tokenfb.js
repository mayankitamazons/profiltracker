var mongoose=require('mongoose');
var schema=mongoose.Schema;
// create user default Schema
var TokenSchema=new schema({
  // _id:mongoose.Types.ObjectId,
  _id:{
    type:String
  },
  access_token:{
    type:String
  }
});
var Tokenfb=mongoose.model('fbtoken',TokenSchema);
module.exports=Tokenfb;
