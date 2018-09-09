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
var Token=mongoose.model('token',TokenSchema);
module.exports=Token;
