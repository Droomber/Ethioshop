const router=require("express").Router(),nodemailer=require("nodemailer"),rateLimit=require("express-rate-limit");
router.post("/",rateLimit({windowMs:60*60*1000,limit:5}),async(req,res)=>{const{name,email,subject,message}=req.body;if(!name||!email||!/^\S+@\S+\.\S+$/.test(email)||!message||String(message).length>5000)return res.status(400).json({message:"Enter your name, valid email and a message under 5000 characters."});if(!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASS||!process.env.CONTACT_TO)return res.status(503).json({message:"Contact email is not configured yet."});try{const t=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==="true",auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});await t.sendMail({from:process.env.SMTP_USER,to:process.env.CONTACT_TO,replyTo:email,subject:`EthioMarket: ${String(subject||"Website message").slice(0,100)}`,text:`From: ${name} <${email}>\n\n${message}`});res.json({message:"Your message has been sent."});}catch(e){console.error(e);res.status(500).json({message:"Email could not be sent."});}});

// Optional SMS notification to the store owner. Configure Twilio credentials to enable it.
router.post("/sms",rateLimit({windowMs:60*60*1000,limit:3}),async(req,res)=>{
 const message=String(req.body.message||"").trim();
 if(!message||message.length>500)return res.status(400).json({message:"Enter a message under 500 characters."});
 if(!process.env.TWILIO_ACCOUNT_SID||!process.env.TWILIO_AUTH_TOKEN||!process.env.TWILIO_PHONE_NUMBER||!process.env.CONTACT_SMS_TO)
  return res.status(503).json({message:"SMS service is not configured. Please use email or phone."});
 try{const twilio=require("twilio")(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);await twilio.messages.create({body:message,from:process.env.TWILIO_PHONE_NUMBER,to:process.env.CONTACT_SMS_TO});res.json({message:"SMS sent."});}
 catch(e){console.error(e);res.status(502).json({message:"SMS could not be sent."});}
});
module.exports=router;
