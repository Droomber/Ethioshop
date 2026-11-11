// Change this to your deployed API URL when hosting, e.g. https://your-api.onrender.com/api
const API=window.ETHIOMARKET_API||"https://ethioshop-5432.onrender.com";
const money=n=>`ETB ${Number(n).toLocaleString("en-ET")}`;
const token=()=>localStorage.getItem("em_token");
async function api(path,options={}){const headers={"Content-Type":"application/json",...(options.headers||{})};if(token())headers.Authorization=`Bearer ${token()}`;const r=await fetch(API+path,{...options,headers});const d=await r.json().catch(()=>({message:"Invalid server response"}));if(!r.ok)throw new Error(d.message||"Request failed");return d;}
function notice(id,msg,error=false){const e=document.getElementById(id);if(e){e.textContent=msg;e.className=error?"notice error":"notice";}}
function currentUser(){try{return JSON.parse(localStorage.getItem("em_user")||"null")}catch{return null}}
function logout(){localStorage.removeItem("em_token");localStorage.removeItem("em_user");location.href="index.html";}
