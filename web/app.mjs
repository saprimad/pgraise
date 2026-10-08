import {timeline,dateText,DAY} from './logic.mjs';
const $=id=>document.getElementById(id);
const demoRecord={program:'PH990',level:'PHD',mode:'S',registered:'2024-09-16',gotMonths:48.08};

function show(r,isDemo=false){
 const t=timeline(r),today=Date.parse(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())+'T00:00:00Z');
 $('program').textContent=`${r.program} · ${r.level==='PHD'?'Doktor Falsafah':'Sarjana'}`;
 $('metadata').textContent=`${r.mode==='S'?'Sepenuh masa':'Separuh masa'} · Daftar ${dateText(t.registered)}${isDemo?' · REKOD CONTOH':''}`;
 $('got').textContent=dateText(t.got);$('submission').textContent=dateText(t.submission);
 const days=Math.floor(t.got/DAY)-Math.floor(today/DAY);
 $('remaining-label').textContent=days>=0?'Baki masa ke sasaran GOT':'Masa selepas sasaran GOT';
 $('remaining').textContent=`${Math.abs(days).toLocaleString('ms-MY')} hari`;
 $('asof').textContent=`Pada ${dateText(today)}`;
 $('milestones').replaceChildren();
 for(const [label,date] of t.milestones){const li=document.createElement('li');const title=document.createElement('span');title.textContent=label;const dt=document.createElement('time');dt.textContent=dateText(date);dt.dateTime=new Date(Math.floor(date/DAY)*DAY).toISOString().slice(0,10);li.append(title,dt);$('milestones').append(li);}
 $('result').hidden=false;$('message').textContent=isDemo?'Paparan contoh. Masukkan nombor pelajar untuk rekod anda.':'Rekod ditemui. Timeline sasaran dipaparkan di bawah.';
}
$('search').addEventListener('submit',async e=>{e.preventDefault();$('result').hidden=true;$('submit').disabled=true;$('message').textContent='Mencari rekod…';try{const res=await fetch('/api/lookup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId:$('student').value.trim()})});const data=await res.json();if(!res.ok)throw Error(data.error||'Carian tidak dapat diselesaikan.');show(data.record);}catch(err){$('message').textContent=err.message;}finally{$('submit').disabled=false;}});
$('demo').addEventListener('click',()=>show(demoRecord,true));$('print').addEventListener('click',()=>window.print());
