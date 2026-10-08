const limits=new Map();
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{...headers,'Content-Type':'application/json; charset=utf-8'}});
export default {async fetch(request){
 const url=new URL(request.url);
 if(url.pathname==='/api/lookup'){
  if(request.method!=='POST')return json({error:'Gunakan POST.'},405);
  const origin=request.headers.get('Origin');
  if(origin&&origin!==url.origin)return json({error:'Permintaan tidak dibenarkan.'},403);
  if(Number(request.headers.get('Content-Length')||0)>256)return json({error:'Permintaan terlalu besar.'},413);
  const ip=request.headers.get('CF-Connecting-IP')||'unknown',now=Date.now(),entry=limits.get(ip);
  if(entry&&entry.until>now&&entry.count>=20)return json({error:'Terlalu banyak carian. Cuba semula selepas satu minit.'},429);
  if(limits.size>5000){for(const [key,item] of limits)if(item.until<now)limits.delete(key);}
  limits.set(ip,{until:entry&&entry.until>now?entry.until:now+60000,count:entry&&entry.until>now?entry.count+1:1});
  let body;
  try{const raw=await request.text();if(raw.length>256)return json({error:'Permintaan terlalu besar.'},413);body=JSON.parse(raw);}catch{return json({error:'Format permintaan tidak sah.'},400);}
  const id=typeof body?.studentId==='string'?body.studentId.trim():'';
  if(!/^[0-9]{6,15}$/.test(id))return json({error:'Semak format nombor pelajar.'},400);
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('got-farmasi-v1:'+id)))).map(v=>v.toString(16).padStart(2,'0')).join('');
  const record=records[hash];
  return record?json({record}):json({error:'Rekod tidak ditemui dalam data Fakulti Farmasi. Semak nombor pelajar atau hubungi pentadbir fakulti.'},404);
 }
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405,headers});
 const path=url.pathname;
 if(!Object.hasOwn(assets,path))return new Response('Not found',{status:404,headers});
 const type=path.endsWith('.css')?'text/css':path.endsWith('.mjs')?'text/javascript':'text/html';
 return new Response(request.method==='HEAD'?null:assets[path],{headers:{...headers,'Content-Type':type+'; charset=utf-8','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"}});
}};
