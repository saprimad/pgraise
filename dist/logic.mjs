export const DAY=86400000;
export function timeline(r){
 const registered=Date.parse(r.registered+'T00:00:00Z');
 if(!Number.isFinite(registered)||!(r.gotMonths>0)) throw Error('Input timeline tidak lengkap.');
 const drpMonths={MASTERS:{S:6,SP:12},PHD:{S:12,SP:18}}[r.level]?.[r.mode];
 if(!drpMonths) throw Error('Tahap atau mod pengajian tiada dalam parameter DRP.');
 const got=registered+(r.gotMonths/12*365-2)*DAY;
 const submission=got-185*DAY;
 const drp=registered+Math.ceil(drpMonths/12*365)*DAY;
 const methodStart=registered+90*DAY;
 const segment=(submission-methodStart-90*DAY)/3;
 return {registered,got,drp,submission,milestones:[
 ['Pendaftaran',registered],['Defence Research Proposal',drp],['Research ethics',drp+60*DAY],
 ['Methodology 1 — sasaran selesai',methodStart+segment],
 ['Methodology 2 — sasaran selesai',methodStart+2*segment],
 ['Methodology 3 — sasaran selesai',submission-90*DAY],
 ['Penyerahan tesis',submission],['Viva / pemeriksaan tesis',submission+70*DAY],['Sasaran GOT',got]
 ]};
}
export const dateText=t=>new Intl.DateTimeFormat('ms-MY',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(Math.floor(t/DAY)*DAY));
