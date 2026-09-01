
(() => {
  "use strict";
  const $ = (s, r=document) => r.querySelector(s);
  const data = window.LESSON_DATA || [];
  const refs = window.LESSON_REFERENCES || {};
  const params = new URLSearchParams(location.search);
  const isStudent = document.documentElement.dataset.mode === "student" || params.get("student")==="1";
  let index = 0, stage = 0, finalMode = false, finalIndex = 0, teacherOpen = false, navMin = false;
  const stageNames = ["Problem","Hint 1","Hint 2","Hint 3","Check","Why","Watch out","Meaning","Say it"];
  const logKey = "clover.lesson8.logs.v1";
  const progressKey = "clover.lesson8.progress.v1";

  function speak(txt) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt || "");
      u.lang = /[ぁ-んァ-ン一-龠]/.test(txt) ? "ja-JP" : "en-US";
      u.rate = parseFloat(document.getElementById("speed")?.value || "1");
      speechSynthesis.speak(u);
    } catch(e) {}
  }
  function saveProgress(){ try{localStorage.setItem(progressKey, JSON.stringify({index,stage,finalMode,finalIndex,updatedAt:new Date().toISOString()}));}catch(e){} }
  function loadProgress(){ if(params.get("resume")!=="1") return; try{const p=JSON.parse(localStorage.getItem(progressKey)||"null"); if(p&&Number.isInteger(p.index)){index=Math.min(data.length-1,Math.max(0,p.index)); stage=p.stage||0; finalMode=!!p.finalMode; finalIndex=p.finalIndex||0;}}catch(e){}}
  function item(){ return data[index]; }
  function safe(t){ return String(t||"").replace(/[<>&]/g, c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c])); }
  function trail(focus){
    const f=focus||"Grammar";
    const cat = f.includes("仮定法") ? "Time" : f.includes("分詞") ? "Modifier" : f.includes("関係") ? "Modifier" : f.includes("語句") ? "Usage" : f.includes("同一語") ? "Vocabulary" : "Grammar";
    return `${cat} › ${safe(f.split("：")[0].slice(0,40))}`;
  }
  function renderHeader(q){ return `<div class="topline"><span class="pill">${q.key}</span><span class="section">${q.sectionName}</span><span class="path"><b>Now</b> ${trail(q.focus)}</span></div><h1>Question ${q.key}</h1>`; }
  function formatQuestion(t){
    let s=safe(t);
    s=s.replace(/\(　　\)|\(　　　　　\)|\( [dswoeb]　　　　　\)/g, `<span class="blank">blank</span>`);
    s=s.replace(/①/g,'<span class="choice-mark">①</span>').replace(/②/g,'<span class="choice-mark">②</span>').replace(/③/g,'<span class="choice-mark">③</span>').replace(/④/g,'<span class="choice-mark">④</span>').replace(/⑤/g,'<span class="choice-mark">⑤</span>');
    return s;
  }
  function questionBlock(q, solved=false){
    const text = solved ? (q.completed || q.question) : q.question;
    return `<div class="question-card"><div class="qtext">${formatQuestion(text)}</div><button class="audio" title="listen" onclick="LessonUI.speakCurrent(${solved?1:0})">🔊</button></div>`;
  }
  function renderOptions(q, showAnswer=false){
    if(!q.options) return "";
    return `<div class="options">${q.options.map((o,i)=>`<div class="opt ${showAnswer&&i===q.answerIndex?'correct':''}"><b>${["①","②","③","④","⑤"][i]||""}</b> ${safe(o)}</div>`).join("")}</div>`;
  }
  function renderTokens(q){ return q.tokens ? `<div class="tokens">${q.tokens.map(t=>`<span>${safe(t)}</span>`).join("")}</div>` : ""; }
  function hintCard(q,n){ const h=(q.hints||[])[n-1] || ["Look carefully.","よく見よう。"]; return `<section class="panel hint"><p class="label">Hint ${n}</p><h2>${safe(h[0])}</h2><p class="jp">${safe(h[1])}</p></section>`; }
  function checkCard(q){ return `<section class="panel check"><p class="label">Check</p><h2>${safe(q.answer)}</h2><div class="answerline">${safe(q.completed||q.answer)}</div>${renderOptions(q,true)}</section>`; }
  function diagram(q){
    const f=q.focus||"";
    if(f.includes("仮定法") || f.includes("would have") || f.includes("Having")) return `<div class="diagram"><span>PAST</span><b>unreal / earlier action</b><span>NOW</span></div>`;
    if(f.includes("分詞") || f.includes("関係")) return `<div class="diagram"><span>Noun</span><b>← explain</b><span>clause / participle</span></div>`;
    if(f.includes("同一語") || f.includes("語句")) return `<div class="diagram"><span>form</span><b>＋</b><span>context</span><b>→</b><span>meaning</span></div>`;
    if(f.includes("否定") || f.includes("scarcely")) return `<div class="diagram"><span>negative idea</span><b>＋</b><span>any</span><b>→</b><span>almost no</span></div>`;
    return `<div class="diagram"><span>shape</span><b>→</b><span>role</span><b>→</b><span>meaning</span></div>`;
  }
  function whyCard(q){ return `<section class="panel why"><p class="label">Why?</p><h2>Find the rule, not only the answer.</h2><p class="jp">答えだけでなく，判断したルールを言えるようにしよう。</p>${diagram(q)}<p class="explain">${safe(q.why)}</p></section>`; }
  function watchCard(q){ return `<section class="panel watch"><p class="label">Watch out</p><h2>Where can we go wrong?</h2><p class="jp">どこで間違えやすいかを先に見ておこう。</p><p class="explain">${safe(q.watch)}</p></section>`; }
  function meaningCard(q){ return `<section class="panel meaning"><p class="label">Meaning</p><h2>${safe(q.translation)}</h2><p class="jp">完成英文</p><div class="answerline">${safe(q.completed||q.answer)}</div></section>`; }
  function sayItCard(q){
    const rawChunks = q.chunks && q.chunks.length ? q.chunks : (q.completed||q.answer||"").split(/\s+/);
    const chunks = rawChunks.slice(0,6);
    const hideCount = Math.max(0, stage-8);
    return `<section class="panel say"><p class="label">Say it</p><h2>Read it once. Then hide it from the end.</h2><p class="jp">一度読んだら，文末側から少しずつ隠していこう。</p><div class="jpbox">${safe(q.translation)}</div><div class="chunks">${chunks.map((c,i)=>`<span class="${i>=chunks.length-hideCount?'hidden':''}">${safe(c)}</span>`).join("")}</div><div class="saybuttons"><button onclick="LessonUI.hideMore()">Hide one more</button><button onclick="LessonUI.showAll()">Show all</button><button onclick="LessonUI.sayAnswer()">🔊 Listen</button></div></section>`;
  }
  function renderNormal(){
    const q=item(); let inner = renderHeader(q);
    if(stage<4){ inner += questionBlock(q,false); inner += stage===0 ? `<section class="panel warm"><h2>First, try it yourself.</h2><p class="jp">まず自分で考えてみよう。</p><p>Check the words, the order, and the grammar clue.</p><p class="jp">語句・語順・文法の手がかりを探そう。</p>${q.format==='choice'?renderOptions(q,false):q.format==='order'?renderTokens(q):""}</section>` : hintCard(q,stage); }
    else if(stage===4) inner += questionBlock(q,true)+checkCard(q);
    else if(stage===5) inner += questionBlock(q,true)+whyCard(q);
    else if(stage===6) inner += questionBlock(q,true)+watchCard(q);
    else if(stage===7) inner += questionBlock(q,true)+meaningCard(q);
    else inner += questionBlock(q,true)+sayItCard(q);
    $("#slide").innerHTML = inner; $("#count").textContent = `${index+1} / ${data.length}`; $("#stageName").textContent = stageNames[Math.min(stage,8)]; updateDots(); saveProgress();
  }
  function renderFinal(){
    const sections=[
      {t:"Quick Response",en:"Say the grammar cue before you check.",jp:"答えを見る前に，文法の手がかりを声に出そう。",items:[["of の後ろ","gerund / -ing"],["ほとんど～ない","scarcely / hardly"],["2つのうちでより～","the + comparative + of the two"],["～という点で","in that"],["～する気になれない","can’t bring oneself to do"]]},
      {t:"Which one?",en:"Choose by the rule.",jp:"訳だけでなく，判断基準で選ぼう。",items:[["discuss ___ the matter","no preposition"],["suggest ___ me that","to"],["a four-___ university","year"],["Had he started...","if omission + inversion"]]},
      {t:"Back Up Challenge",en:"Hide from the end and say the whole sentence.",jp:"文末から隠して，全文を言ってみよう。",backup:true},
      {t:"Finish",en:"Nice work. You can now sort scattered grammar points by structure, time, modifier, and usage.",jp:"よくできました。ばらばらに見える問題も，構造・時間・修飾・語法に分けて判断できます。"}
    ];
    const s=sections[Math.min(finalIndex,sections.length-1)];
    let body=`<div class="final"><p class="kicker">Clover Lesson 8 COMPLETE</p><h1>${s.t}</h1><h2>${s.en}</h2><p class="jp">${s.jp}</p>`;
    if(s.items) body+=`<div class="finalgrid">${s.items.map(x=>`<div><span>${safe(x[0])}</span><b>${safe(x[1])}</b></div>`).join("")}</div>`;
    if(s.backup){ const q=data.find(x=>x.key==="5-(6)")||data[0]; body+=`<div class="jpbox">${safe(q.translation)}</div><div class="chunks">${(q.chunks||[]).map(c=>`<span>${safe(c)}</span>`).join("")}</div>`; }
    $("#slide").innerHTML=body+"</div>"; $("#count").textContent=`FINAL ${finalIndex+1} / ${sections.length}`; $("#stageName").textContent="Final"; updateDots(); saveProgress();
  }
  function updateDots(){ const total=finalMode?4:9, active=finalMode?finalIndex:Math.min(stage,8); $("#dots").innerHTML=Array.from({length:total}).map((_,i)=>`<span class="${i<=active?'on':''}"></span>`).join(""); }
  function next(){ if(finalMode){ if(finalIndex<3) finalIndex++; render(); return;} if(stage<8) stage++; else if(index<data.length-1){index++; stage=0;} else {finalMode=true; finalIndex=0;} render(); }
  function prev(){ if(finalMode){ if(finalIndex>0) finalIndex--; else {finalMode=false; index=data.length-1; stage=8;} render(); return;} if(stage>0) stage--; else if(index>0){index--; stage=8;} render(); }
  function openMap(){ $("#modalroot").innerHTML=`<div class="modal"><div class="modalbox"><button class="x" onclick="LessonUI.closeMap()">×</button><h2>${safe(refs.title||"Map")}</h2><p>${safe(refs.lead||"")}</p><div class="mapgrid">${(refs.sections||[]).map(s=>`<section><h3>${safe(s.title)}</h3><p>${safe(s.jp)}</p><ul>${(s.items||[]).map(i=>`<li>${safe(i)}</li>`).join("")}</ul></section>`).join("")}</div></div></div>`; }
  function closeMap(){ $("#modalroot").innerHTML=""; }
  function renderTeacher(){
    if(isStudent){ $("#teacher").style.display="none"; return; }
    $("#teacher").className=teacherOpen?"teacher open":"teacher";
    $("#teacher").innerHTML=teacherOpen?`<div class="teacher-head"><b>TEACHER</b><button onclick="LessonUI.toggleTeacher()">−</button></div><p>個人を特定できる情報は入力しない。</p><div class="logtypes">${["誤答","質問","説明成功","追記","改善"].map(t=>`<button onclick="LessonUI.addLog('${t}')">${t}</button>`).join("")}</div><button onclick="LessonUI.showLogs()">過去記録</button>`:`<b>TEACHER</b><button onclick="LessonUI.toggleTeacher()">＋</button>`;
  }
  function addLog(type){ const note=prompt(`${type}を記録（生徒名は入れない）`); if(!note) return; if(/[さんくん君]|[0-9０-９]+番/.test(note)&&!confirm("個人を特定できる可能性があります。このまま保存しますか？")) return; const logs=JSON.parse(localStorage.getItem(logKey)||"[]"); logs.push({id:String(Date.now()),type,note,lessonId:"clover.lesson8",questionId:item()?.id,questionKey:item()?.key,createdAt:new Date().toISOString(),deletedAt:null}); localStorage.setItem(logKey,JSON.stringify(logs)); }
  function showLogs(){ const logs=JSON.parse(localStorage.getItem(logKey)||"[]").filter(x=>!x.deletedAt); alert(logs.map((l,i)=>`${i+1}. [${l.questionKey}] ${l.type}: ${l.note}`).join("\n")||"記録はまだありません。"); }
  function renderNav(){ $("#nav").className=navMin?"nav min":"nav"; }
  function render(){ finalMode?renderFinal():renderNormal(); renderTeacher(); renderNav(); }
  loadProgress();
  document.addEventListener("keydown",e=>{ if(e.key==="ArrowRight") next(); if(e.key==="ArrowLeft") prev(); if(e.key==="m") openMap(); });
  window.LessonUI={next,prev,openMap,closeMap,toggleTeacher(){teacherOpen=!teacherOpen;renderTeacher();},addLog,showLogs,speakCurrent(solved){const q=item(); speak(solved?(q.completed||q.answer):(q.question||"").replace(/\([^)]*\)/g," blank "));},hideMore(){stage=Math.min(stage+1,8+(item().chunks||[]).length);render();},showAll(){stage=8;render();},sayAnswer(){speak(item().completed||item().answer);},toggleNav(){navMin=!navMin;renderNav();},reset(){index=0;stage=0;finalMode=false;finalIndex=0;render();}};
  document.addEventListener("DOMContentLoaded",()=>{ $("#prev").onclick=prev; $("#next").onclick=next; $("#mapBtn").onclick=openMap; $("#resetBtn").onclick=()=>LessonUI.reset(); $("#navMin").onclick=()=>LessonUI.toggleNav(); render(); });
})();
