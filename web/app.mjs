import {timeline,dateText,DAY} from './logic.mjs';
import {calendarMeta,events,statusOn,sortedEvents,relevantEvents} from './calendar-data.mjs';
const $=id=>document.getElementById(id);
const demoRecord={program:'PH990',level:'PHD',mode:'S',registered:'2024-09-16',gotMonths:48.08,name:'Sample postgraduate student',faculty:'Faculty of Pharmacy, UiTM',mainSupervisor:'Sample main supervisor',coSupervisors:['Sample co-supervisor']};

function show(r,isDemo=false){
 const t=timeline(r),today=Date.parse(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())+'T00:00:00Z');
 $('program').textContent=`${r.program} · ${r.level==='PHD'?'Doctor of Philosophy':'Master’s degree'}`;
 $('metadata').textContent=`${r.mode==='S'?'Full-time':'Part-time'} · Registered ${dateText(t.registered)}${isDemo?' · SAMPLE RECORD':''}`;
 $('student-name').textContent=r.name?.trim()||'Not recorded';
 $('faculty').textContent=r.faculty?.trim()||'Faculty of Pharmacy, UiTM';
 $('main-supervisor').textContent=r.mainSupervisor?.trim()||'Not recorded';
 const coSupervisors=Array.isArray(r.coSupervisors)?r.coSupervisors.filter(name=>typeof name==='string'&&name.trim()):[];
 $('co-supervisors').replaceChildren();
 if(coSupervisors.length){const list=document.createElement('ul');for(const name of coSupervisors){const item=document.createElement('li');item.textContent=name;list.append(item);}$('co-supervisors').append(list);}else{$('co-supervisors').textContent='Not recorded';}
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

const todayMY=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const academicDate=s=>s?new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',day:'numeric',month:'short',year:'numeric'}).format(new Date(s+'T12:00:00Z')):'TBA';
const eventLabel=e=>e.end?(e.start===e.end?academicDate(e.end):academicDate(e.start)+' – '+academicDate(e.end)):'Date to be announced';
function displayEvents(container,items,empty='No matching activities.'){
 container.replaceChildren();
 if(!items.length){const p=document.createElement('p');p.className='note';p.textContent=empty;container.append(p);return;}
 for(const e of sortedEvents(items)){
 const box=document.createElement('article');box.className='calendar-event';
 const top=document.createElement('div');top.className='calendar-event-top';
 const title=document.createElement('strong');title.textContent=e.title;
 const status=document.createElement('span');status.className='calendar-status';status.textContent=statusOn(e,todayMY());top.append(title,status);
 const date=document.createElement('time');date.textContent=eventLabel(e);
 const category=document.createElement('small');category.textContent=e.category+(e.conditions?' · '+e.conditions:'');
 box.append(top,date,category);container.append(box);
 }
}

function selectedModeEvents(){const cats=new Set([...document.querySelectorAll('.category-choice:checked')].map(e=>e.value));return sortedEvents(relevantEvents($('mode-filter').value).filter(e=>cats.has(e.category)));}
function renderAcademic(){
 const host=$('calendar-list');host.replaceChildren();
 const list=selectedModeEvents();
 if(!list.length){host.textContent='No activities match these filters.';return;}
 for(const e of list){
  const box=document.createElement('article');box.className='calendar-event';
  const label=document.createElement('label');label.className='event-choice-label';
  const check=document.createElement('input');check.type='checkbox';check.className='event-choice';check.value=e.id;
  check.disabled=!e.end||e.end<todayMY();check.checked=!check.disabled;
  const heading=document.createElement('strong');heading.textContent=e.title;label.append(check,heading);
  const date=document.createElement('time');date.textContent=eventLabel(e);
  const note=document.createElement('small');note.textContent=statusOn(e,todayMY())+(e.conditions?' · '+e.conditions:'');
  box.append(label,date,note);host.append(box);
 }
}
$('calendar-source').textContent=calendarMeta.source+' · Verification: '+calendarMeta.verified;
$('mode-filter').addEventListener('change',renderAcademic);
document.querySelectorAll('.category-choice').forEach(x=>x.addEventListener('change',renderAcademic));renderAcademic();
$('student-mode').addEventListener('change',()=>{const mode=$('student-mode').value;displayEvents($('student-deadlines'),mode?relevantEvents(mode).filter(e=>!e.end||e.end>=todayMY()):[],'Choose an academic mode to see applicable dates.');});
const oldShow=show;
show=function(r,isDemo=false){oldShow(r,isDemo);$('student-mode').value='';displayEvents($('student-deadlines'),[],'Choose an academic mode to see applicable dates.');};
function showTab(){
 const cal=location.hash==='#academic-calendar';
 $('academic-calendar').hidden=!cal;$('got-finder').hidden=cal;$('got-explain').hidden=cal;
 document.querySelectorAll('[data-tab]').forEach(a=>{if(a.dataset.tab===(cal?'calendar':'got'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
}
window.addEventListener('hashchange',showTab);showTab();
function icsEscape(s){return String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function foldIcs(line){let out='',n=0;for(const ch of line){const size=new TextEncoder().encode(ch).length;if(n+size>73){out+='\r\n ';n=1;}out+=ch;n+=size;}return out;}
const compact=s=>s.replaceAll('-','');
function downloadCalendar(){
 const ids=new Set([...document.querySelectorAll('.event-choice:checked')].map(x=>x.value));
 const chosen=selectedModeEvents().filter(e=>ids.has(e.id)&&e.end&&e.end>=todayMY());
 const reminders=[...document.querySelectorAll('.reminder-choice:checked')].map(x=>Number(x.value));
 if(!chosen.length){$('export-status').textContent='Choose at least one dated activity that has not passed.';return;}
 const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const entries=chosen.map(e=>{
  const date=compact(e.end); // 09:00 MYT equals 01:00 UTC
  const alerts=reminders.map(days=>['BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsEscape('PGRaise: '+e.title),'TRIGGER:'+(days===0?'PT0S':'-P'+days+'D'),'END:VALARM'].join('\r\n'));
  return ['BEGIN:VEVENT','UID:'+e.id+'-sep2026@pgraise','DTSTAMP:'+stamp,'DTSTART:'+date+'T010000Z','DTEND:'+date+'T013000Z','TRANSP:TRANSPARENT','SUMMARY:'+icsEscape('PGRaise deadline: '+e.title),'DESCRIPTION:'+icsEscape((e.start!==e.end?'Activity period '+e.start+' to '+e.end+'. ':'')+(e.conditions||'')+' | '+calendarMeta.source),...alerts,'END:VEVENT'].join('\r\n');
 });
 const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//PGRaise//Academic Reminders//EN','CALSCALE:GREGORIAN',...entries,'END:VCALENDAR'].flatMap(s=>s.split('\r\n')).map(foldIcs).join('\r\n')+'\r\n';
 const url=URL.createObjectURL(new Blob([body],{type:'text/calendar;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='pgraise-selected-deadlines.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 $('export-status').textContent=chosen.length+' event(s) exported. Verify imported notifications in your calendar app.';
}
$('calendar-ics').addEventListener('click',downloadCalendar);
