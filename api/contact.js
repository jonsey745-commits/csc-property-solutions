const LIMITS={name:100,phone:30,email:254,postcode:10,message:5000};
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
  const origin=req.headers.origin;
  if(origin){try{const u=new URL(origin);const host=req.headers['x-forwarded-host']||req.headers.host;if(u.host!==host)return res.status(403).json({error:'Forbidden'});}catch{return res.status(403).json({error:'Forbidden'});}}
  const raw=req.body;
  if(JSON.stringify(raw||{}).length>12000)return res.status(413).json({error:'Request too large'});
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return res.status(400).json({error:'Invalid submission'});
  if(raw._honey)return res.status(200).json({ok:true});
  const fields={};
  for(const [key,max] of Object.entries(LIMITS)){
    if(typeof raw[key]!=='string')return res.status(400).json({error:'Invalid fields'});
    fields[key]=raw[key].trim();
    if(!fields[key]||fields[key].length>max)return res.status(400).json({error:'Invalid fields'});
  }
  if(!emailPattern.test(fields.email))return res.status(400).json({error:'Invalid email'});
  const {RESEND_API_KEY,CONTACT_TO_EMAIL,CONTACT_FROM_EMAIL}=process.env;
  if(!RESEND_API_KEY||!CONTACT_TO_EMAIL||!CONTACT_FROM_EMAIL)return res.status(503).json({error:'Email service unavailable'});
  const rows=Object.entries(fields).map(([key,value])=>`<tr><th style="text-align:left;padding:8px;border:1px solid #ddd">${escapeHtml(key)}</th><td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('');
  try{
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:CONTACT_FROM_EMAIL,to:[CONTACT_TO_EMAIL],reply_to:fields.email,subject:'New CSC driveway or patio enquiry',html:`<h2>New CSC website enquiry</h2><table style="border-collapse:collapse">${rows}</table>`})});
    if(!response.ok){console.error('Resend send failed',response.status);return res.status(502).json({error:'Delivery failed'});}
    return res.status(200).json({ok:true});
  }catch(error){console.error('Email request failed',error?.message);return res.status(502).json({error:'Delivery failed'});}
}
