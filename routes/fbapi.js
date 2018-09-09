const express=require('express');
const request=require('request');
const router=express.Router();
//const FbTable=require('../Model/fbtoken');
router.post('/updateaccesstoken',function(req,res,next){
    	 res.send({"code":404,"status":false,"message":"Failed Try Again"});


	});
module.exports=router;
