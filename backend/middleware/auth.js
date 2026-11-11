const jwt=require("jsonwebtoken"),User=require("../models/User");
async function protect(req,res,next){try{const token=(req.headers.authorization||"").replace(/^Bearer\s+/i,"");if(!token)return res.status(401).json({message:"Please log in."});const p=jwt.verify(token,process.env.JWT_SECRET);req.user=await User.findById(p.id).select("-password");if(!req.user)return res.status(401).json({message:"Account not found."});next();}catch{return res.status(401).json({message:"Invalid or expired session."});}}
function adminOnly(req,res,next){if(req.user?.role!=="admin")return res.status(403).json({message:"Administrator access required."});next();}
module.exports={protect,adminOnly};
