const fs=require('fs'),vm=require('vm');
global.window=global;
for(const f of ['lesson-data.js','lesson08-output-v1.js','lesson-data-v1.js','lesson08-learning-v1.js']) vm.runInThisContext(fs.readFileSync(f,'utf8'),{filename:f});
const D=window.LESSON_DATA; const err=[]; const allowed=new Set(['blank','choice','order','translate','write']);
if(!Array.isArray(D)||D.length!==37) err.push(`item count: ${D&&D.length}`);
(D||[]).forEach((x,n)=>{
  for(const k of ['id','key','question','answer','completed']) if(!String(x[k]||'').trim()) err.push(`${n+1} missing ${k}`);
  if(!allowed.has(x.format)) err.push(`${x.id} bad format ${x.format}`);
  if(!Array.isArray(x.hints)||x.hints.length<2) err.push(`${x.id} hints`);
  if((x.hints||[]).some(h=>!h||!String(h.en||'').trim()||!String(h.jp||'').trim())) err.push(`${x.id} bilingual hints`);
  if(!Array.isArray(x.correct)||!x.correct.length) err.push(`${x.id} why/correct`);
  if(!Array.isArray(x.wrong)||!x.wrong.length) err.push(`${x.id} wrong analysis`);
  if(!Array.isArray(x.outputChunks)||!x.outputChunks.length) err.push(`${x.id} output chunks`);
  if(String(x.completed||'').split(/\s+/).length>=6 && x.outputChunks.length<2) err.push(`${x.id} Back Up must use phrase chunks`);
  if(!Array.isArray(x.mapPath)||x.mapPath.length<2) err.push(`${x.id} mapPath`);
  if((x.format==='order'||x.format==='write') && String(x.audioQ||'').trim()) err.push(`${x.id} stage0 answer leakage risk`);
});
if(!window.LESSON_FINAL_CHECK||!Array.isArray(window.LESSON_FINAL_CHECK.sections)||window.LESSON_FINAL_CHECK.sections.length<5) err.push('Final Check sections');
const teacher=fs.readFileSync('index.html','utf8'),student=fs.readFileSync('student-index.html','utf8');
for(const html of [['index.html',teacher],['student-index.html',student]]){
  for(const req of ['lesson-data.js','lesson08-output-v1.js','lesson-data-v1.js','lesson-references-v1.js','lesson08-learning-v1.js','lesson08-v1.css','_engine/v1/engine.js','_engine/v1/audio.js']) if(!html[1].includes(req)) err.push(`${html[0]} missing ${req}`);
  for(const legacy of ['app.js','layout-fix.js','styles.css']) if(html[1].includes(`src="${legacy}"`)||html[1].includes(`href="${legacy}"`)) err.push(`${html[0]} still loads legacy ${legacy}`);
}
if(!teacher.includes('_teacher/v1/teacher.js')) err.push('teacher entry missing shared teacher layer');
if(student.includes('_teacher/v1/teacher.js')||student.includes('teacherMode":true')||student.includes('teaching.v1')) err.push('student teacher leak');
const css=fs.readFileSync('lesson08-v1.css','utf8');
for(const req of ['data-lesson-stage="output"','question-card{display:none','final-stage','concept-map-drawer','data-long="1"']) if(!css.includes(req)) err.push(`lesson css missing ${req}`);
const enhance=fs.readFileSync('lesson08-enhance-v1.js','utf8');
for(const req of ['lesson:render','where-am-i','question-viz','buildMap','clueTerms']) if(!enhance.includes(req)) err.push(`enhance missing ${req}`);
const exp=JSON.parse(fs.readFileSync('student-export.json','utf8'));
if(exp.policy!=='allowlist') err.push('student export must be allowlist');
if(exp.status!=='ready'||exp.releaseGate!=='student-production-explicit-approval-required') err.push('ready release gate missing');
for(const req of ['lesson-data.js','lesson08-output-v1.js','lesson-data-v1.js','lesson-references-v1.js','lesson08-learning-v1.js','lesson08-enhance-v1.js','lesson08-v1.css','student-index.html']) if(!exp.files.includes(req)) err.push(`student export missing ${req}`);
const meta=JSON.parse(fs.readFileSync('lesson-meta.json','utf8')); if(meta.status!=='ready'||meta.id!=='clover.lesson8'||meta.questionCount!==37) err.push('lesson meta ready/id/count');
if(err.length){console.error(err.join('\n'));process.exit(1)}
console.log(`OK: ${D.length} items / Engine v1 / Small Step Hints / MAP / phrase Back Up / Final Check / student-safe / ready / production-gated`);
