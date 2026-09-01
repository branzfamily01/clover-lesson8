(()=>{
'use strict';
const src=(window.CLOVER_LESSON8&&Array.isArray(window.CLOVER_LESSON8.items))?window.CLOVER_LESSON8.items:[];
const circled={'①':0,'②':1,'③':2,'④':3,'⑤':4};
function answerIndex(x){
  const m=String(x.answer||'').match(/[①②③④⑤]/);
  return m?circled[m[0]]:null;
}
function stripChoice(s){return String(s||'').replace(/^[①②③④⑤]\s*/, '');}
function tokensFromQuestion(q){
  const text=String(q||'');
  const m=text.match(/\(([^()]*(?:\/[^()]*)+)\)/);
  return m?m[1].split('/').map(x=>x.trim()).filter(Boolean):[];
}
function asText(v){return Array.isArray(v)?v.join(' '):String(v||'');}
function mapHints(x){
  const h=(x.hints||[]).map(v=>asText(v).trim()).filter(Boolean);
  const decision=asText(x.decision).trim();
  const jp=[h[0]||'文の形と語法の手がかりを探そう。',h[1]||'似た形と区別しよう。',decision||'最後に完成文全体で確認しよう。'];
  return [
    ['Where should you look first?',jp[0]],
    ['What rule or pattern do you need?',jp[1]],
    ['How can you decide?',jp[2]]
  ];
}
function mapChunks(x){
  if(x.output&&Array.isArray(x.output.phrases)&&x.output.phrases.length) return x.output.phrases;
  const c=String(x.completed||x.answer||'').replace(/\n/g,' ').split(/\s+/).filter(Boolean);
  const groups=[]; for(let i=0;i<c.length;i+=Math.ceil(c.length/4)||1) groups.push(c.slice(i,i+Math.ceil(c.length/4)||1).join(' '));
  return groups.slice(0,5);
}
window.LESSON_DATA=src.map(x=>({
  id:x.id,key:x.key,section:x.section,sectionName:x.sectionName,
  format:x.type==='multiBlank'||x.type==='input'?'blank':x.type,
  focus:x.focus,
  question:x.question,
  options:(x.choices||[]).map(stripChoice),
  answerIndex:answerIndex(x),
  answer:x.answer,
  completed:x.completed||x.answer,
  translation:x.translation||'',
  hints:mapHints(x),
  why:Array.isArray(x.why)?x.why.join(' '):asText(x.why),
  watch:Array.isArray(x.wrong)&&x.wrong.length?x.wrong.join(' '):(x.decision||'正解の型と誤答の型を比べよう。'),
  chunks:mapChunks(x),
  tokens:x.type==='order'?tokensFromQuestion(x.question):[],
  sourceRefs:x.sourceRefs||[],
  mapPath:x.mapPath||[]
}));
})();
