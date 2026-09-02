(()=>{
'use strict';
const lesson=window.CLOVER_LESSON8;if(!lesson||!Array.isArray(lesson.items))return;
const manual={
 '1-(1)':['Tom was afraid of','her not being able','to catch the last train.'],
 '1-(2)':['You can get a good seat','for the musical','providing you reserve it','well in advance.'],
 '1-(3)':['There is scarcely','any coffee left','in the pot.'],
 '1-(4)':['Please be seated','in the chair.'],
 '1-(5)':['The girl with whom','I went to the movies','is not my girlfriend.'],
 '1-(6)':["I’m tired.","I’d rather not go out","for dinner,","if you don’t mind."],
 '1-(12)':['The possibility','that they would go abroad this year','was slim.'],
 '1-(13)':['Had he started','at a younger age,','he might have made it','to the Major Leagues.'],
 '5-(1)':['This is','the very thing','that I have been looking for.'],
 '5-(2)':['Pictures and photos','showing scenes','from the past 100 years','will go on display','at the City Museum.'],
 '5-(3)':["I’d like","a big one","with cream on it."],
 '5-(4)':['My troubles','deprived me of sleep','last night.'],
 '5-(5)':['In my opinion,','you should avoid paying','more tax','than you need to.'],
 '5-(6)':['The pharmacist','was worried about','the patient’s health','and got him','to quit smoking.'],
 '5-(7)':['While training','to become a dancer,','she is having a hard time','making ends meet.']
};
const starters=new Set(['that','who','whom','whose','which','when','where','why','if','because','while','although','though','unless','before','after','with','without','from','for','to','of','in','on','at','by','as','than','instead','and','but','or']);
function tidy(s){return String(s||'').replace(/\s+/g,' ').trim();}
function splitLine(line){
 const words=tidy(line).split(' ').filter(Boolean);if(words.length<=4)return words.length?[words.join(' ')]:[];
 const out=[];let cur=[];
 for(let i=0;i<words.length;i++){
  const w=words[i],bare=w.toLowerCase().replace(/^[“‘(\[]+|[.,!?;:’”\])]+$/g,''),remaining=words.length-i;
  if(cur.length>=2&&starters.has(bare)&&remaining>=2){out.push(cur.join(' '));cur=[];}
  cur.push(w);
  if((/[,;:]$/.test(w)&&cur.length>=2)||cur.length>=5){out.push(cur.join(' '));cur=[];}
 }
 if(cur.length)out.push(cur.join(' '));
 for(let i=out.length-1;i>0;i--){if(out[i].split(/\s+/).length===1){out[i-1]+=' '+out[i];out.splice(i,1);}}
 if(out.length===1&&words.length>=6){const cut=Math.ceil(words.length/2);return[words.slice(0,cut).join(' '),words.slice(cut).join(' ')];}
 return out;
}
function make(item){if(manual[item.key])return manual[item.key].slice();const lines=String(item.completed||item.answer||'').split(/\n+/).map(tidy).filter(Boolean);let p=lines.flatMap(splitLine).filter(Boolean);if(p.length>=2)return p.slice(0,6);const s=tidy(item.completed||item.answer||'');const w=s.split(' ').filter(Boolean);if(w.length>=6){const cut=Math.ceil(w.length/2);return[w.slice(0,cut).join(' '),w.slice(cut).join(' ')];}return[s].filter(Boolean);}
for(const item of lesson.items){const p=make(item);item.output=Object.assign({},item.output||{},{jp:item.translation||(Array.isArray(item.translations)?item.translations.join(' / '):''),phrases:p});}
})();
