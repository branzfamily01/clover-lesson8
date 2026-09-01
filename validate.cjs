const fs=require('fs'),vm=require('vm');
global.window=global;
for(const f of ['lesson-data.js','data.js']) vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});
const D=window.LESSON_DATA; const err=[];
if(!Array.isArray(D)||D.length!==37) err.push(`item count: ${D&&D.length}`);
(D||[]).forEach((x,n)=>{
  for(const k of ['id','key','question','answer','completed']) if(!String(x[k]||'').trim()) err.push(`${n+1} missing ${k}`);
  if(!Array.isArray(x.hints)||x.hints.length<2) err.push(`${x.id} hints`);
  if((x.hints||[]).some(h=>!Array.isArray(h)||h.length<2||!String(h[0]).trim()||!String(h[1]).trim())) err.push(`${x.id} bilingual hint`);
  if(!Array.isArray(x.chunks)||x.chunks.length<1) err.push(`${x.id} output chunks`);
});
for(const f of ['index.html','student-index.html']){
  const s=fs.readFileSync(f,'utf8');
  for(const req of ['lesson-data.js','data.js','references.js','app.js']) if(!s.includes(req)) err.push(`${f} missing ${req}`);
}
const student=fs.readFileSync('student-index.html','utf8');
for(const bad of ['data-mode="teacher"','source-lock.json','Teacher Log']) if(student.includes(bad)) err.push(`student leak: ${bad}`);
const app=fs.readFileSync('app.js','utf8');
if(!/hideMore\(\).*stage=Math\.min\(stage\+1/.test(app.replace(/\s+/g,''))) err.push('Back Up must hide one chunk at a time');
if(err.length){console.error(err.join('\n'));process.exit(1)}
console.log(`OK: ${D.length} items / bilingual hints / complete sentences / Back Up / student mode`);
