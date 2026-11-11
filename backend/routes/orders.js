const router=require("express").Router(),Order=require("../models/Order"),{protect,adminOnly}=require("../middleware/auth");
router.get("/mine",protect,async(req,res,next)=>{try{res.json({orders:await Order.find({user:req.user._id}).sort({createdAt:-1})});}catch(e){next(e);}});
router.get("/",protect,adminOnly,async(_req,res,next)=>{try{res.json({orders:await Order.find().populate("user","name email").sort({createdAt:-1})});}catch(e){next(e);}});
router.patch("/:id/status",protect,adminOnly,async(req,res,next)=>{try{const allowed=["processing","shipped","delivered","cancelled"];if(!allowed.includes(req.body.status))return res.status(400).json({message:"Invalid status."});const o=await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true});if(!o)return res.status(404).json({message:"Order not found."});res.json({order:o});}catch(e){next(e);}});
module.exports=router;
