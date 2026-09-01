const fs=require('fs'), vm=require('vm');
global.window=global;
for(const f of ['lesson-data.js','lesson8-output-defaults.js','lesson-data-adapter.js']) vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});
const D=window.CLOVER_LESSON8 && window.CLOVER_LESSON8.items;
const err=[];
if(!Array.isArray(D)||D.length!==37) err.push(`item count: ${D&&D.length}`);
(D||[]).forEach((x,n)=>{
  for(const k of ['id','problem','answer','meaning','why','watch']) if(!String(x[k]||'').trim()) err.push(`${n+1} missing ${k}`);
  if(!Array.isArray(x.hints)) err.push(`${x.id} hints`);
  if((x.hints||[]).some(h=>!String(h).includes('\n'))) err.push(`${x.id} bilingual hint`);
  if(!Array.isArray(x.chunks)||x.chunks.length<2) err.push(`${x.id} output chunks`);
  if(!Array.isArray(x.mapPath)||!x.mapPath.length) err.push(`${x.id} mapPath`);
});
const student=fs.readFileSync('student-index.html','utf8');
for(const bad of ['lesson-references.js','source-lock.json','data-teacher="1"','teacher-dock','Teacher Log']) if(student.includes(bad)) err.push(`student leak: ${bad}`);
const enhance=fs.readFileSync('lesson08-enhance.js','utf8');
if(!/backupHidden\+\+/.test(enhance)) err.push('Back Up must increment one chunk');
if(/backupHidden\s*=\s*chunks\.length/.test(enhance)) err.push('Back Up bulk hide detected');
if(err.length){console.error(err.join('\n'));process.exit(1)}
console.log(`OK: ${D.length} items / bilingual hints / complete answers / Back Up one chunk / student export clean`);
