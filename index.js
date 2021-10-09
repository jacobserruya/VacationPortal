const express = require('express');
const path = require('path');
const app = express();
const mongoose = require("mongoose");
const Posts = require("./Posts.js");
const { response } = require('express');
const { title } = require('process');

mongoose.connect('mongodb+srv://root:252525@cluster0.l8df5.mongodb.net/News?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{

    console.log("Connected to database!");
}).catch((err)=>{
    console.log(err.menssage)

})


app.use( express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


app.get('/',(req,res)=>{

    if(req.query.search == null){
        Posts.find({}).sort({'_id': -1}).exec(function (err,posts){
             // console.log(posts[0]);
             Posts.find({}).sort({'views': -1}).exec(function(err,postsTop){

           res.render('home',{posts:posts,postsTop:postsTop});
             })
        })
        
    }else{
        Posts.find({
            $or:[
               { title:{$regex:req.query.search,$options:"i"}},
                {maincontent:{$regex:req.query.search,$options:"i"}}]
            },
    (err,posts)=>{
        res.render('search',{posts:posts});
        })
        
    }

  
});


app.get('/:slug',(req,res)=>{
                    
    Posts.findOneAndUpdate({slug:req.params.slug},{$inc:{views:1}},{new:true},(err,response)=>{
        if(response!=null){
        Posts.find({}).sort({'views': -1}).exec(function(err,postsTop){
        res.render('single',{notice:response,posts:postsTop})
    })

}else {
    res.redirect("/");
}
    })
    //res.send(req.params.slug);
   


})



app.listen(5000,()=>{
    console.log('server running on port 5000!');
})