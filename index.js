const express=require('express');
const mongoose=require('mongoose');
// body parser is use to process input to node
var bodyParser = require('body-parser');
// set up express app
var app = express();
// connect to mongodb database
mongoose.connect('mongodb://13.232.61.198:27017/profiletrackerdb');
mongoose.Promise=global.Promise;
// use body parse  before request type
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// innitize route
//assuming app is express Object.
app.get('/',function(req,res){

     res.sendFile('index.html', { root: __dirname });

});
app.get('/tokenupdate',function(req,res){

     res.sendFile('tokenupdate.html', { root: __dirname });

});
app.use('/fbapp/v2/users',require('./routes/api'));

//app.use('/ui',require('./routes/fbapi'));
// error handling midlehandling
app.use(function(err,req,res,next){
 //console.log(err);
   res.status(422).send({error:err.message})
});
// listen for request
app.listen(process.env.port || 4000,function(){
 console.log('Listing to Request');
});
