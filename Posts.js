var mongoose =require("mongoose");
var Schema = mongoose.Schema;


var postSchema = new Schema({
title :String,
content:String,
image:String,
slug:String,
actor:String,
views:Number,
maincontent:String


},{collection:"posts"})

var Posts = mongoose.model("posts",postSchema);

module.exports = Posts; 