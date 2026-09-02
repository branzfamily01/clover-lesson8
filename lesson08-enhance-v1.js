(()=>{
'use strict';
const refs=window.LESSON_REFERENCES||null;
const toolbar=document.querySelector('.toolbar');
const stageEl=document.getElementById('stage');
if(!toolbar||!stageEl)return;
const esc=(s='')=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function isWord(ch){return !!ch&&/[A-Za-z0-9_]/.test(ch);}
function clueTerms(q){
 const f=String(q?.focus||''), text=String(q?.question||'');
 if(/動名詞/.test(f)) return ['of','not'];
 if(/関係/.test(f)) return ['with','whom','that','which'].filter(x=>text.toLowerCase().includes(x));
 if(/比較/.test(f)) return ['of the two','than'].filter(x=>text.toLowerCase().includes(x));
 if(/仮定/.test(f)) return ['Had','But for','might have'].filter(x=>text.includes(x));
 if(/否定|scarcely|hardly/.test(f)) return ['any','scarcely','hardly'].filter(x=>text.toLowerCase().includes(x.toLowerCase()));
 if(/分詞/.test(f)) return ['Having','while','showing'].filter(x=>text.toLowerCase().includes(x.toLowerCase()));
 if(/語法|seat|suggest|deprive|avoid|discuss/.test(f)) return ['seat','suggest','deprived','avoid','discuss'].filter(x=>text.toLowerCase().includes(x.toLowerCase()));
 return [];
}
function ranges(text,terms=[]){const src=String(text||''),low=src.toLowerCase(),all=[];for(const raw of [...terms].filter(Boolean).map(String).sort((a,b)=>b.length-a.length)){const n=raw.toLowerCase();let from=0;while(n&&from<src.length){const s=low.indexOf(n,from);if(s<0)break;const e=s+n.length,left=!isWord(raw[0])||s===0||!isWord(src[s-1]),right=!isWord(raw[raw.length-1])||e===src.length||!isWord(src[e]);if(left&&right)all.push({s,e,len:e-s});from=s+Math.max(1,n.length);}}all.sort((a,b)=>a.s-b.s||b.len-a.len);const picked=[];for(const x of all){if(!picked.some(p=>x.s<p.e&&x.e>p.s))picked.push(x);}return picked.sort((a,b)=>a.s-b.s);}
function highlight(text,terms=[]){const src=String(text||''),rs=ranges(src,terms);if(!rs.length)return esc(src);let out='',pos=0;for(const r of rs){out+=esc(src.slice(pos,r.s));out+=`<mark class="hint-mark">${esc(src.slice(r.s,r.e))}</mark>`;pos=r.e;}return out+esc(src.slice(pos));}
function renderQuestion(q,state){const node=document.querySelector('.question');if(!node||!q)return;const isHint=String(state?.stage||'').startsWith('hint:');node.innerHTML=highlight(q.question||'',isHint?clueTerms(q):[]);}
function visualFor(q){
 const f=String(q?.focus||'');
 if(/動名詞/.test(f))return {kind:'formula',title:'形を先に決める',tokens:[{text:'preposition',role:'modal'},{text:'-ing',role:'verb'},{text:'not は -ing の前',role:''}],note:'前置詞の後ろは名詞相当。'};
 if(/関係/.test(f))return {kind:'flow',title:'元の形に戻す',nodes:['two sentences','→','missing part','→','preposition','→','relative pronoun']};
 if(/比較/.test(f))return {kind:'decision',title:'比べる数を先に見る',rows:[{condition:'2つ',result:'comparative'},{condition:'3つ以上',result:'superlative'}]};
 if(/仮定/.test(f))return {kind:'timeline',title:'時間を決める',items:[{label:'PAST FACT',sub:'現実'},{label:'UNREAL PAST',sub:'Had S + p.p.'},{label:'RESULT',sub:'might/could have + p.p.'}]};
 if(/分詞構文|Having/.test(f))return {kind:'flow',title:'主語をそろえる',nodes:['participial clause','→','same subject','→','main clause']};
 if(/語法|seat|suggest|deprive|avoid|discuss/.test(f))return {kind:'flow',title:'動詞が要求する形',nodes:['verb','→','its pattern','→','correct complement']};
 return {kind:'flow',title:'判断の順序',nodes:['shape','→','role','→','meaning','→','context']};
}
function visual(v){if(!v||!v.kind)return'';const title=v.title?`<div class="viz-title">${esc(v.title)}</div>`:'';if(v.kind==='flow')return `${title}<div class="viz-flow">${(v.nodes||[]).map(x=>`<span class="${x==='→'?'arrow':''}">${esc(x)}</span>`).join('')}</div>`;if(v.kind==='timeline')return `${title}<div class="viz-timeline">${(v.items||[]).map(x=>`<article><b>${esc(x.label)}</b><span>${esc(x.sub||'')}</span></article>`).join('<i>→</i>')}</div>`;if(v.kind==='formula')return `${title}<div class="viz-formula">${(v.tokens||[]).map(x=>`<span class="${esc(x.role||'')}">${esc(x.text)}</span>`).join('<i>＋</i>')}</div>${v.note?`<p class="viz-note">${esc(v.note)}</p>`:''}`;if(v.kind==='decision')return `${title}<div class="viz-decision">${(v.rows||[]).map(x=>`<div><b>${esc(x.condition)}</b><i>→</i><strong>${esc(x.result)}</strong></div>`).join('')}</div>`;return'';}
function enhance(state){
 const q=window.LessonEngine?.getCurrent?.();
 const inQ=state.slideIndex>=0&&state.slideIndex<(window.LESSON_DATA||[]).length;
 if(inQ){stageEl.dataset.lessonStage=state.stage||'problem';stageEl.dataset.long=String(q?.question||'').length>150?'1':'0';stageEl.dataset.dense=(q?.wrong||[]).length>=4?'1':'0';}else{delete stageEl.dataset.lessonStage;delete stageEl.dataset.long;delete stageEl.dataset.dense;}
 if(!q)return;renderQuestion(q,state);document.querySelectorAll('.where-am-i,.question-viz').forEach(n=>n.remove());if(!inQ)return;
 const after=['answer','reason','wrong','translation','output'].includes(state.stage);
 if(after&&Array.isArray(q.mapPath)&&q.mapPath.length){const n=document.createElement('div');n.className='where-am-i';n.innerHTML=`<span>Now</span>${q.mapPath.map((x,i)=>`<b>${esc(x)}</b>${i<q.mapPath.length-1?'<i>›</i>':''}`).join('')}`;document.querySelector('.topline')?.insertAdjacentElement('afterend',n);}
 if(state.stage==='reason'){const p=document.querySelector('.stage-panel');if(p){const n=document.createElement('div');n.className='question-viz';n.innerHTML=visual(visualFor(q));p.appendChild(n);}}
}
function refSection(s){const lead=s.lead?`<p class="map-lead">${esc(s.lead)}</p>`:'';if(s.type==='map')return `${lead}<div class="concept-grid">${(s.groups||[]).map(g=>`<article class="concept-card ${g.lesson?'in-lesson':'outside'}"><div class="concept-status">${g.lesson?'LESSON 8':'つながり'}</div><h3>${esc(g.title)}</h3><div class="concept-items">${(g.items||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div><p>${esc(g.note||'')}</p></article>`).join('')}</div>`;if(s.type==='compare')return `${lead}<div class="map-compare">${(s.columns||[]).map(c=>`<article><span class="map-badge">${esc(c.badge||'')}</span><h3>${esc(c.title)}</h3><p>${esc(c.body)}</p><strong>${esc(c.meaning||'')}</strong></article>`).join('')}</div>`;if(s.type==='matrix')return `${lead}<div class="matrix-wrap"><table><thead><tr>${(s.headers||[]).map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${(s.rows||[]).map(r=>`<tr>${r.map((x,i)=>`<${i===0?'th':'td'}>${esc(x)}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;if(s.type==='branch')return `${lead}<div class="branch-grid">${(s.rows||[]).map(r=>`<article class="branch-card"><h3>${esc(r.head)}</h3><div class="branch-core">${esc(r.core)}</div><div class="branch-list">${(r.branches||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div></article>`).join('')}</div>`;if(s.type==='flow')return `${lead}<div class="big-flow">${(s.nodes||[]).map(x=>`<span class="${x==='→'?'arrow':''}">${esc(x)}</span>`).join('')}</div>`;return lead;}
function buildMap(){if(!refs)return;const btn=document.createElement('button');btn.type='button';btn.className='icon-btn map-btn';btn.textContent='🗺 地図';btn.title='Lesson 8 全体地図';toolbar.insertBefore(btn,document.getElementById('menuBtn')?.nextSibling||toolbar.firstChild);const drawer=document.createElement('div');drawer.className='concept-map-drawer';drawer.hidden=true;drawer.innerHTML=`<div class="concept-map-card" role="dialog" aria-modal="true"><header class="concept-map-head"><div><small>REFERENCE MAP</small><h2>${esc(refs.title||'Lesson Map')}</h2><p>${esc(refs.subtitle||'')}</p></div><button type="button" class="map-close">×</button></header><nav class="map-tabs">${(refs.sections||[]).map((s,i)=>`<button type="button" data-i="${i}" class="${i===0?'active':''}">${esc(s.title)}</button>`).join('')}</nav><main class="concept-map-body"></main></div>`;document.body.appendChild(drawer);const body=drawer.querySelector('.concept-map-body'),tabs=[...drawer.querySelectorAll('[data-i]')];const show=i=>{const s=refs.sections?.[i];if(!s)return;tabs.forEach((t,n)=>t.classList.toggle('active',n===i));body.innerHTML=`<section><h2>${esc(s.title)}</h2>${refSection(s)}</section>`;};const close=()=>{drawer.hidden=true;btn.focus();};btn.addEventListener('click',()=>{drawer.hidden=false;show(0);drawer.querySelector('.map-close')?.focus();});drawer.querySelector('.map-close').addEventListener('click',close);drawer.addEventListener('click',e=>{if(e.target===drawer)close();});tabs.forEach(t=>t.addEventListener('click',()=>show(Number(t.dataset.i))));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)close();});}
buildMap();
window.addEventListener('lesson:render',e=>enhance(e.detail||{}));
requestAnimationFrame(()=>enhance(window.LessonEngine?.getState?.()||{}));
})();
