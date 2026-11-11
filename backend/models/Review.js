const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true,index:true},
 user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 userName:{type:String,required:true},rating:{type:Number,min:1,max:5,required:true},
 comment:{type:String,required:true,maxlength:1000,trim:true}
},{timestamps:true});
schema.index({product:1,user:1},{unique:true});
module.exports=mongoose.model("Review",schema);
