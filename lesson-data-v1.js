(()=>{
'use strict';
const src=(window.CLOVER_LESSON8&&Array.isArray(window.CLOVER_LESSON8.items))?window.CLOVER_LESSON8.items:[];
const circled={'①':0,'②':1,'③':2,'④':3,'⑤':4,'⑥':5};
const sectionFormat={1:'choice',2:'blank',3:'blank',4:'choice',5:'order'};
const enLead=['Which part gives you the clue?','What rule or pattern do you remember?','How does that decide the answer?'];
const mapTop={1:'Grammar & Structure',2:'Vocabulary & Usage',3:'Vocabulary & Usage',4:'Error Correction',5:'Word Order'};
function text(v){return Array.isArray(v)?v.join(' '):String(v||'');}
function answerIndex(x){const m=String(x.answer||'').match(/[①②③④⑤⑥]/);return m?circled[m[0]]:null;}
function stripChoice(s){return String(s||'').replace(/^[①②③④⑤⑥]\s*/,'').trim();}
function safeAudioQ(x){
 let q=String(x.question||'');
 q=q.replace(/\([^)]*　[^)]*\)/g,' blank ').replace(/（[^）]*　[^）]*）/g,' blank ');
 q=q.replace(/\(\s*\)/g,' blank ');
 if(Array.isArray(x.choices)&&x.choices.length) q=q.replace(/\s*\[[^\]]+\]\s*/g,' blank ');
 return q;
}
function chunks(x){
 if(x.output&&Array.isArray(x.output.phrases)&&x.output.phrases.length) return x.output.phrases.slice();
 const s=String(x.completed||x.answer||'').replace(/\s+/g,' ').trim();
 if(!s) return [];
 const w=s.split(' '); if(w.length<=4) return [s];
 const size=Math.max(2,Math.ceil(w.length/4)), out=[];
 for(let i=0;i<w.length;i+=size) out.push(w.slice(i,i+size).join(' '));
 return out.slice(0,6);
}
function tokens(x){
 if(Array.isArray(x.tokens)&&x.tokens.length) return x.tokens.slice();
 const q=String(x.question||'');
 const b=q.match(/\[([^\]]+)\]/)||q.match(/\(([^()]*(?:\/[^()]*)+)\)/);
 if(!b) return [];
 return b[1].split(/\s*\/\s*|\s*,\s*/).map(v=>v.trim()).filter(Boolean);
}
function hints(x){
 const raw=Array.isArray(x.hints)?x.hints.map(text).filter(Boolean):[];
 const jp=[raw[0]||'まず，文のどこが判断の手がかりになるか見つけよう。',raw[1]||'次に，その形で使う文法・語法を思い出そう。',text(x.decision)||'最後に，文全体の意味と形がそろうか確かめよう。'];
 return jp.slice(0,raw.length>=3?3:Math.max(2,raw.length||2)).map((v,i)=>({en:enLead[Math.min(i,2)],jp:v,lookAt:[]}));
}
function format(x){
 const t=String(x.type||'').toLowerCase();
 if(t==='choice'||t==='select') return 'choice';
 if(t==='order'||t==='reorder') return 'order';
 if(t==='translate') return 'translate';
 if(t==='write') return 'write';
 if(t==='blank'||t==='input'||t==='multiblank') return 'blank';
 return sectionFormat[Number(x.section)]||'choice';
}
window.LESSON_DATA=src.map((x)=>{
 const f=format(x), why=Array.isArray(x.why)?x.why:[text(x.why||x.decision||x.focus)].filter(Boolean), wrong=Array.isArray(x.wrong)?x.wrong:[text(x.wrong)].filter(Boolean);
 const focus=String(x.focus||x.sectionName||'').trim(), branch=focus.split(/[｜：]/)[0].trim()||mapTop[x.section]||'Grammar';
 return {
   id:x.id,key:x.key,section:String(x.section),sectionName:x.sectionName||'',format:f,focus,
   question:x.question||'',choices:Array.isArray(x.choices)?x.choices.map(stripChoice):[],options:Array.isArray(x.choices)?x.choices.map(stripChoice):[],answerIndex:answerIndex(x),
   answer:x.answer||x.completed||'',completed:x.completed||x.answer||'',translation:x.translation||(Array.isArray(x.translations)?x.translations.join(' / '):''),
   audioQ:(f==='order'||f==='write')?'':safeAudioQ(x),audioA:x.completed||x.answer||'',
   hints:hints(x),correct:why,wrong:wrong.length?wrong:[text(x.decision)||'正解の形と，選びたくなる誤答の形を比べよう。'],method:text(x.decision)||'',
   outputCue:x.translation||(Array.isArray(x.translations)?x.translations.join(' / '):''),outputChunks:chunks(x),tokens:tokens(x),
   mapPath:[mapTop[x.section]||'Grammar',branch,focus].filter((v,i,a)=>v&&a.indexOf(v)===i),
   sourceRefs:x.sourceRefs||[]
 };
});
})();
