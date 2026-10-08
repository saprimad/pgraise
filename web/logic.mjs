export const DAY=86400000;
export function timeline(r){
 const registered=Date.parse(r.registered+'T00:00:00Z');
 if(!Number.isFinite(registered)||!(r.gotMonths>0)) throw Error('The timeline data is incomplete.');
 const drpMonths={MASTERS:{S:6,SP:12},PHD:{S:12,SP:18}}[r.level]?.[r.mode];
 if(!drpMonths) throw Error('No proposal defence parameters are available for this study level or mode.');
 const got=registered+(r.gotMonths/12*365-2)*DAY;
 const submission=got-185*DAY;
 const drp=registered+Math.ceil(drpMonths/12*365)*DAY;
 const methodStart=registered+90*DAY;
 const segment=(submission-methodStart-90*DAY)/3;
 return {registered,got,drp,submission,milestones:[
 ['Registration',registered],['Research proposal defence (DRP)',drp],['Research ethics approval target',drp+60*DAY],
 ['Methodology 1 — completion target',methodStart+segment],
 ['Methodology 2 — completion target',methodStart+2*segment],
 ['Methodology 3 — completion target',submission-90*DAY],
 ['Thesis submission',submission],['Viva voce / thesis examination',submission+70*DAY],['GOT target',got]
 ]};
}
export const dateText=t=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(Math.floor(t/DAY)*DAY));
