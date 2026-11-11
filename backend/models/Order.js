const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 items:[{product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},name:String,price:Number,quantity:Number}],
 total:{type:Number,required:true},
 status:{type:String,enum:["awaiting_payment","paid","processing","shipped","delivered","cancelled"],default:"awaiting_payment"},
 payment:{provider:{type:String,default:"chapa"},status:{type:String,enum:["pending","success","failed"],default:"pending"},merchantReference:String,chapaReference:String,checkoutUrl:String,currency:{type:String,default:"ETB"}},
 shipping:{fullName:String,phone:String,address:String,city:String}
},{timestamps:true});
module.exports=mongoose.model("Order",schema);
