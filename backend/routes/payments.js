const router=require("express").Router(),crypto=require("crypto"),Product=require("../models/Product"),Order=require("../models/Order"),{protect}=require("../middleware/auth");
const base=()=>process.env.CHAPA_API_BASE||"https://api.chapa.co/v1";
router.post("/chapa/initialize",protect,async(req,res,next)=>{try{
 if(!process.env.CHAPA_PRIVATE_KEY)return res.status(503).json({message:"Payment test key is not configured on the server."});
 const{items,shipping}=req.body;if(!Array.isArray(items)||!items.length||!shipping?.fullName||!shipping?.phone||!shipping?.address)return res.status(400).json({message:"Add products and complete shipping information."});
 const orderItems=[];let total=0;
 for(const item of items){const p=await Product.findById(item.productId);const q=Math.max(1,Math.floor(Number(item.quantity)||1));if(!p||p.stock<q)return res.status(400).json({message:`Not enough stock for ${p?.name||"an item"}.`});orderItems.push({product:p._id,name:p.name,price:p.price,quantity:q});total+=p.price*q;}
 const merchantReference=("EM"+Date.now().toString()).slice(0,20);
 const order=await Order.create({user:req.user._id,items:orderItems,total,shipping,payment:{provider:"chapa",status:"pending",merchantReference,currency:process.env.CHAPA_CURRENCY||"ETB"}});
 const userEmail=req.user.email,parts=(shipping.fullName||"Customer").trim().split(/\s+/);
 const response=await fetch(`${base()}/payments/hosted`,{method:"POST",headers:{"Authorization":`Bearer ${process.env.CHAPA_PRIVATE_KEY}`,"Content-Type":"application/json","Idempotency-Key":crypto.randomUUID()},body:JSON.stringify({
   amount:Math.round(total*100),currency:process.env.CHAPA_CURRENCY||"ETB",merchant_reference:merchantReference,
   customer:{first_name:parts[0],last_name:parts.slice(1).join(" ")||"Customer",email:userEmail,phone_number:shipping.phone},
   return_url:`${process.env.FRONTEND_URL||"https://droomber.github.io/Ethioshop/frontend"}/payment-result.html?order=${order._id}`,
   meta:{order_id:String(order._id)}
 })});
 const data=await response.json();if(!response.ok||!data?.data?.checkout_url){await Order.findByIdAndDelete(order._id);return res.status(502).json({message:data.message||"Could not initialize Chapa checkout."});}
 order.payment.checkoutUrl=data.data.checkout_url;await order.save();
 res.status(201).json({checkoutUrl:data.data.checkout_url,orderId:order._id,message:"Redirecting to Chapa hosted checkout."});
 }catch(e){next(e);}});
// router.get("/chapa/verify/:orderId",protect,async(req,res,next)=>{try{
 const order = await Order.findOne({_id:req.params.orderId,user:req.user._id});if(!order)return res.status(404).json({message:"Order not found."});
 if(order.payment.status==="success")return res.json({paid:true,status:"success",order});
 const ref=req.query.reference;if(!ref)return res.json({paid:false,status:"pending",message:"Payment reference is not available yet. Check again shortly."});
 const response=await fetch(`${base()}/payments/${encodeURIComponent(ref)}/verify`,{headers:{"Authorization":`Bearer ${process.env.CHAPA_PRIVATE_KEY}`}});
 const result=await response.json();const payment=result?.data;
 if(!response.ok||!payment)return res.status(502).json({message:"Could not verify payment with provider."});
 const amountMatches=Number(payment.amount)===Math.round(order.total*100);
 const currencyMatches=payment.currency===(process.env.CHAPA_CURRENCY||"ETB");
 if(payment.status==="SUCCESS"&&amountMatches&&currencyMatches){
   order.payment.status="success";order.payment.chapaReference=ref;order.status="paid";await order.save();
   for(const item of order.items)await Product.findByIdAndUpdate(item.product,{$inc:{stock:-item.quantity}});
   return res.json({paid:true,status:"success",order});
 }
 if(["FAILED","CANCELLED","INCOMPLETE","BLOCKED"].includes(payment.status)){order.payment.status="failed";await order.save();}
 res.json({paid:false,status:payment.status||"pending",message:"Payment is not confirmed. Do not treat the order as paid."});
//  }catch(e){next(e);}});
module.exports=router;
