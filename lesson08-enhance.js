
(function(){
 const D=window.CLOVER_LESSON8.items;
 const app=document.getElementById('app');
 const isTeacher=document.body.dataset.teacher==='1';
 const params=new URLSearchParams(location.search);
 const year=params.get('year')||'2026', cls=params.get('class')||'1A';
 const resume=params.get('resume')==='1';
 const progressKey=`clover.lesson8.progress.${year}.${cls}`;
 let state={view:'cover',index:0,stage:'problem',hint:0,backupHidden:0};
 if(resume){ try{Object.assign(state,JSON.parse(localStorage.getItem(progressKey)||'{}'));}catch(e){} }
 const esc=s=>String(s).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
 const fmt=s=>esc(s).replace(/\n/g,'<br>');
 function save(){ localStorage.setItem(progressKey,JSON.stringify(state)); }
 function stageOrder(item){ return ['problem',...(item.hints.length?['hint']:[]),'check','why','watch','meaning','backup']; }
 function setStage(s){state.stage=s;if(s!=='hint')state.hint=0;if(s!=='backup')state.backupHidden=0;save();render();}
 function nav(delta){state.index=Math.max(0,Math.min(D.length-1,state.index+delta));state.stage='problem';state.hint=0;state.backupHidden=0;save();render();}
 function controls(item){
   const order=stageOrder(item), pos=order.indexOf(state.stage);
   let next=pos<order.length-1?`<button data-act="stage" data-val="${order[pos+1]}">Next →</button>`:`<button data-act="nextq">Next Problem →</button>`;
   let prev=pos>0?`<button class="ghost" data-act="stage" data-val="${order[pos-1]}">← Back</button>`:`<button class="ghost" data-act="map">MAP</button>`;
   return `<div class="navline">${prev}<div class="counter">${state.index+1} / ${D.length}</div>${next}</div>`;
 }
 function problemBlock(i){
   const opts=i.options?.length?`<div class="options">${i.options.map(o=>`<div>${esc(o)}</div>`).join('')}</div>`:'';
   return `<div class="problem-text">${fmt(i.problem)}</div>${opts}`;
 }
 function complete(i){return `<div class="complete">${fmt(i.answer)}</div>`;}
 function mapPath(i){return i.mapPath.length?`<div class="path">${i.mapPath.map(x=>`<span>${esc(x)}</span>`).join('<b>→</b>')}</div>`:''}
 function renderItem(){
   const i=D[state.index]; let body='';
   if(state.stage==='problem') body=`<div class="eyebrow">${i.section} · ${i.id.split('.').pop()}</div>${problemBlock(i)}<button class="audio" data-act="audio">▶ Read</button>`;
   if(state.stage==='hint'){
      const h=i.hints[Math.min(state.hint,i.hints.length-1)]||'';
      body=`${problemBlock(i)}<div class="hint"><div class="hint-en">${fmt(h)}</div></div><div class="hintdots">${i.hints.map((_,n)=>`<button data-act="hint" data-val="${n}" class="${n===state.hint?'on':''}">${n+1}</button>`).join('')}</div>`;
   }
   if(state.stage==='check') body=`<div class="stage-title">CHECK</div>${complete(i)}<div class="answer-mark">✓</div><button class="audio" data-act="audio">▶ Read</button>`;
   if(state.stage==='why') body=`<div class="stage-title">WHY?</div>${complete(i)}${mapPath(i)}<div class="explain">${esc(i.why)}</div>`;
   if(state.stage==='watch') body=`<div class="stage-title">WATCH OUT</div>${complete(i)}<div class="watch">${esc(i.watch)}</div>`;
   if(state.stage==='meaning') body=`<div class="stage-title">MEANING</div>${complete(i)}<div class="meaning">${esc(i.meaning)}</div>`;
   if(state.stage==='backup'){
      const chunks=i.chunks?.filter(Boolean)||[i.answer];
      const hidden=Math.min(state.backupHidden,chunks.length);
      body=`<div class="say">SAY IT.<small>言ってみよう。</small></div><div class="cue">${esc(i.meaning)}</div><div class="chunks">${chunks.map((c,n)=>`<div class="chunk ${n>=chunks.length-hidden?'hidden':''}">${n>=chunks.length-hidden?'████████████':esc(c)}</div>`).join('')}</div><div class="backup-actions">${hidden<chunks.length?`<button data-act="hidechunk">Hide one chunk</button>`:`<button data-act="resetbackup" class="ghost">Show again</button>`}</div>`;
   }
   app.innerHTML=`<main class="slide">${body}${controls(i)}</main>`;
 }
 function renderMap(){
   const groups=[...new Set(D.map(x=>x.section))];
   app.innerHTML=`<main class="slide map-slide"><div class="map-head"><div><div class="cover-kicker">CLOVER · LESSON 8</div><h1>GRAMMAR MAP</h1></div><div class="map-count">37 Problems</div></div><div class="map-grid">${groups.map(g=>`<section><h2>${g}</h2>${D.map((x,n)=>x.section===g?`<button data-act="jump" data-val="${n}"><b>${x.id.split('.').pop()}</b><span>${esc((x.mapPath&&x.mapPath[0])||'語法')}</span></button>`:'').join('')}</section>`).join('')}</div><div class="map-concepts"><button data-act="concept">Concept MAP</button><button data-act="cover" class="ghost">Cover</button></div></main>`;
 }
 function renderConcept(){
   const nodes={
    '準動詞':['動名詞：not + -ing / 意味上の主語','分詞：名詞との能動・受動','分詞構文：主節主語との一致','get + O + to do'],
    '関係・節':['前置詞 + whom','同格 that','in that「～という点で」','the very + 名詞 + that'],
    '否定・仮定':['scarcely any = almost no','But for ～ = without ～','If S had p.p. → Had S p.p.'],
    '比較・語法':['the + 比較級 + of the two','discuss + O','take + 人 + by the hand','数詞-単数名詞 + 名詞'],
    '表現・構造':['leave O as it is','deprive A of B','avoid doing','have a hard time doing']};
   app.innerHTML=`<main class="slide concept-slide"><div class="map-head"><div><div class="cover-kicker">LESSON 8</div><h1>CONCEPT MAP</h1></div><button data-act="map" class="ghost">← MAP</button></div><div class="concept-grid">${Object.entries(nodes).map(([k,v])=>`<details><summary>${k}</summary>${v.map(x=>`<div>${x}</div>`).join('')}</details>`).join('')}</div></main>`;
 }
 function renderCover(){
   app.innerHTML=`<main class="slide cover"><div class="cover-inner"><div class="clovermark">CLOVER</div><div class="lessonno">LESSON 8</div><button data-act="map">START</button></div></main>`;
 }
 function render(){ if(state.view==='cover')renderCover(); else if(state.view==='map')renderMap(); else if(state.view==='concept')renderConcept(); else renderItem(); dock(); }
 function dock(){
   const old=document.querySelector('.teacher-dock'); if(old)old.remove();
   if(!isTeacher) return;
   const d=document.createElement('aside');d.className='teacher-dock';
   d.innerHTML=`<div class="dock-top"><b>${year} · ${cls}</b><button data-act="dockmin">−</button></div><div class="dock-body"><div class="dock-icons">${['✕ 誤答','? 質問','💡 説明成功','✎ 追記','🔧 改善'].map(x=>`<button data-act="log" data-val="${x}">${x}</button>`).join('')}</div><textarea id="teachMemo" placeholder="short memo"></textarea><button data-act="memo">Save</button></div>`;document.body.appendChild(d);
 }
 document.addEventListener('click',e=>{
   const b=e.target.closest('[data-act]'); if(!b)return; const a=b.dataset.act,v=b.dataset.val;
   if(a==='stage'){state.view='item';setStage(v);}
   if(a==='nextq'){state.view='item';nav(1)}
   if(a==='map'){state.view='map';save();render()}
   if(a==='cover'){state.view='cover';save();render()}
   if(a==='concept'){state.view='concept';save();render()}
   if(a==='jump'){state.view='item';state.index=+v;state.stage='problem';state.hint=0;state.backupHidden=0;save();render()}
   if(a==='hint'){state.hint=+v;render()}
   if(a==='hidechunk'){state.backupHidden++;save();render()}
   if(a==='resetbackup'){state.backupHidden=0;save();render()}
   if(a==='audio')LessonAudio.speak(D[state.index],state.stage)
   if(a==='dockmin') document.querySelector('.teacher-dock').classList.toggle('min');
   if(a==='log'){const k=`clover.lesson8.teacherlog.${year}.${cls}`;const arr=JSON.parse(localStorage.getItem(k)||'[]');arr.push({at:new Date().toISOString(),item:D[state.index]?.id,type:v});localStorage.setItem(k,JSON.stringify(arr));}
   if(a==='memo'){const t=document.getElementById('teachMemo');const k=`clover.lesson8.teachermemo.${year}.${cls}`;const arr=JSON.parse(localStorage.getItem(k)||'[]');arr.push({at:new Date().toISOString(),item:D[state.index]?.id,text:t.value});localStorage.setItem(k,JSON.stringify(arr));t.value='';}
 });
 state.view=state.view||'cover'; render();
})();
