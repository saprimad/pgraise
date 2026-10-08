import {timeline,dateText,DAY} from './logic.mjs';
const $=id=>document.getElementById(id);
const demoRecord={program:'PH990',level:'PHD',mode:'S',registered:'2024-09-16',gotMonths:48.08};

function show(r,isDemo=false){
 const t=timeline(r),today=Date.parse(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())+'T00:00:00Z');
 $('program').textContent=`${r.program} · ${r.level==='PHD'?'Doctor of Philosophy':'Master’s degree'}`;
 $('metadata').textContent=`${r.mode==='S'?'Full-time':'Part-time'} · Registered ${dateText(t.registered)}${isDemo?' · SAMPLE RECORD':''}`;
 $('got').textContent=dateText(t.got);$('submission').textContent=dateText(t.submission);
 const days=Math.floor(t.got/DAY)-Math.floor(today/DAY);
 $('remaining-label').textContent=days>=0?'Time until the GOT target':'Time since the GOT target';
 $('remaining').textContent=`${Math.abs(days).toLocaleString('en-GB')} days`;
 $('asof').textContent=`As of ${dateText(today)}`;
 $('milestones').replaceChildren();
 for(const [label,date] of t.milestones){const li=document.createElement('li');const title=document.createElement('span');title.textContent=label;const dt=document.createElement('time');dt.textContent=dateText(date);dt.dateTime=new Date(Math.floor(date/DAY)*DAY).toISOString().slice(0,10);li.append(title,dt);$('milestones').append(li);}
 $('result').hidden=false;$('message').textContent=isDemo?'This is a sample timeline. Enter your student number to view your own record.':'Record found. Your target timeline is shown below.';
}
$('search').addEventListener('submit',async e=>{e.preventDefault();$('result').hidden=true;$('submit').disabled=true;$('message').textContent='Finding your record…';try{const res=await fetch(new URL('/api/lookup', document.querySelector('meta[name="lookup-origin"]')?.content || window.location.origin),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentId:$('student').value.trim()})});const data=await res.json();if(!res.ok)throw Error(data.error||'Unable to complete the search. Please try again.');show(data.record);}catch(err){$('message').textContent=err.message;}finally{$('submit').disabled=false;}});
$('demo').addEventListener('click',()=>show(demoRecord,true));$('print').addEventListener('click',()=>window.print());
