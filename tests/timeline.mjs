import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {timeline,DAY,dateText} from '../dist/logic.mjs';
const data=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url)));
for(const r of Object.values(data.records)){
 const t=timeline(r);
 assert.equal(t.submission,t.got-185*DAY);
 assert.ok(t.got>t.registered);
 assert.ok(Number.isFinite(t.drp));
}
for(const [level,mode,months] of [['PHD','S',12],['PHD','SP',18],['MASTERS','S',6],['MASTERS','SP',12]]){
 const t=timeline({registered:'2024-09-16',gotMonths:48.08,level,mode});
 assert.equal((t.drp-t.registered)/DAY,Math.ceil(months/12*365));
}
assert.equal(dateText(timeline({registered:'2024-09-16',gotMonths:48.08,level:'PHD',mode:'S'}).got),'15 Sep 2028');
assert.throws(()=>timeline({registered:'bad',gotMonths:1}));
assert.throws(()=>timeline({registered:'2024-09-16',gotMonths:48.08,level:'UNKNOWN',mode:'S'}));
console.log('Timeline checks passed for '+Object.keys(data.records).length+' records and all four DRP combinations.');
