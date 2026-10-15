// IPSis September 2026 calendar transcribed from the owner-supplied poster.
// Dates are inclusive. Verify against updated IPSis notices before relying on deadlines.
export const calendarMeta={semester:'September 2026',source:'UiTM IPSis Academic Calendar for Postgraduate Students — September 2026 (owner-supplied image)',verified:'Pending source review'};
export const events=[
{id:'registration-returning',title:'Returning postgraduate registration',category:'Registration',modes:['research','coursework','mixed'],start:'2026-09-24',end:'2026-10-18'},
{id:'registration-new-research',title:'New research postgraduate registration',category:'Registration',modes:['research'],start:'2026-09-07',end:'2026-11-30',conditions:'New students only'},
{id:'registration-new-coursework',title:'New coursework or mixed-mode registration',category:'Registration',modes:['coursework','mixed'],start:'2026-09-07',end:'2026-09-27',conditions:'New students only'},
{id:'semester-start',title:'Semester commencement',category:'Registration',modes:['research','coursework','mixed'],start:'2026-09-28',end:'2026-09-28'},
{id:'refusco',title:'REFUSco screening open',category:'Research',modes:['research'],start:'2026-09-24',end:'2026-10-18'},
{id:'research-progress',title:'Research progress report submission',category:'Research',modes:['research'],start:null,end:null,status:'TBA'},
{id:'research-thesis',title:'Research thesis submission',category:'Research',modes:['research'],start:null,end:null,status:'TBA'},
{id:'continuation',title:'Continuation appeal of study (RMP/RMTP)',category:'Research',modes:['research'],start:null,end:null,status:'TBA'},
{id:'tuition',title:'Tuition fee payment deadline',category:'Fees',modes:['research','coursework','mixed'],start:'2026-11-18',end:'2026-11-18'},
{id:'revocation-gt',title:'Revocation of student status (GT)',category:'Fees',modes:['research','coursework','mixed'],start:'2026-11-25',end:'2026-11-25',conditions:'Administrative consequence; does not establish the status of any individual student'},
{id:'rpgt-appeal',title:'Appeal for revocation of student status (RPGT)',category:'Fees',modes:['research','coursework','mixed'],start:'2026-11-25',end:'2026-12-03',conditions:'For affected students'},
{id:'rpgt-result',title:'RPGT appeal result',category:'Fees',modes:['research','coursework','mixed'],start:'2026-11-26',end:'2026-12-04',conditions:'For applicants'},
{id:'fee-defer-apply',title:'Fee deferment online application',category:'Fees',modes:['research','coursework','mixed'],start:'2026-09-24',end:'2026-10-18'},
{id:'fee-defer-result',title:'Fee deferment application result',category:'Fees',modes:['research','coursework','mixed'],start:'2026-10-19',end:'2026-10-19'},
{id:'rpgt-fee',title:'Last fee payment for approved RPGT',category:'Fees',modes:['research','coursework','mixed'],start:'2026-12-11',end:'2026-12-11',conditions:'Approved RPGT applicants only'},
{id:'defer-fee',title:'Last fee payment for successful fee deferment',category:'Fees',modes:['research','coursework','mixed'],start:'2026-12-22',end:'2026-12-22',conditions:'Successful deferment applicants only'},
{id:'revocation-final',title:'Final revocation of student status (final GT)',category:'Fees',modes:['research','coursework','mixed'],start:'2026-12-31',end:'2026-12-31',conditions:'Administrative event; does not establish the status of any individual student'},
{id:'ips-seminar-one',title:'IPSis Research Skill Seminar Series 3/2026',category:'Research',modes:['research'],start:'2026-11-30',end:'2026-12-02',conditions:'Physical seminar; cluster dates differ'},
{id:'ips-seminar-two',title:'IPSis Research Skill Seminar Series 4/2026',category:'Research',modes:['research'],start:'2026-12-28',end:'2027-01-05',conditions:'UFUTURE MOOC Online'},
{id:'course-reg',title:'Course registration',category:'Coursework',modes:['coursework','mixed'],start:'2026-09-24',end:'2026-10-18'},
{id:'add-drop',title:'Add and drop courses',category:'Coursework',modes:['coursework','mixed'],start:'2026-09-24',end:'2026-10-18'},
{id:'course-validation',title:'Validation of registered courses',category:'Coursework',modes:['coursework','mixed'],start:'2026-10-26',end:'2026-11-01'},
{id:'suf0',title:'SuFO screening open',category:'Coursework',modes:['coursework','mixed'],start:'2026-12-28',end:'2027-01-31'},
{id:'viva-mixed',title:'Mixed-mode thesis submission for viva',category:'Mixed mode',modes:['mixed'],start:null,end:null,status:'TBA'},
{id:'mixed-final',title:'Mixed-mode final thesis submission after correction',category:'Mixed mode',modes:['mixed'],start:null,end:null,status:'TBA'}
];
export const statusOn=(event,today)=>!event.end?'TBA':event.end<today?'Past':event.start>today?'Upcoming':'In progress';
export const sortedEvents=(items)=>[...items].sort((a,b)=>(a.end||'9999').localeCompare(b.end||'9999')||a.title.localeCompare(b.title));
export const relevantEvents=(mode)=>events.filter(e=>!mode||e.modes.includes(mode));
