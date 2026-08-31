(() => {
  'use strict';
  const stage=document.getElementById('stage');
  const overlay=document.getElementById('teacherOverlay');
  const body=document.getElementById('teacherBody');
  const close=document.getElementById('teacherClose');
  if(!stage||!overlay||!body) return;
  const fields=[['wrong','誤答'],['question','質問'],['success','説明成功'],['addition','追加事項'],['improvement','改善点']];
  const btn=document.createElement('button');
  btn.type='button';btn.className='teacher-fab';btn.textContent='授業メモ';btn.setAttribute('aria-label','教師用授業メモ');
  stage.appendChild(btn);

  function context(){
    const app=window.CloverLesson8App; const item=app?.getCurrentItem(); const c=app?.getContext()||{};
    return {item,year:c.schoolYear||String(new Date().getFullYear()),className:c.className||'default'};
  }
  function keyFor(ctx){return `clover.teacher.${ctx.year}.${ctx.className}.clover.lesson8.${ctx.item?.key||'lesson'}`;}
  function load(ctx){try{return JSON.parse(localStorage.getItem(keyFor(ctx))||'{}')}catch(_){return {}}}
  function open(){
    const ctx=context(); const saved=load(ctx);
    body.innerHTML=`<div class="teacher-form"><div class="decision"><b>${ctx.item?ctx.item.key:'Lesson 8'}</b> · ${ctx.year} · ${ctx.className}</div>${fields.map(([k,label])=>`<div class="teacher-field"><label for="teacher-${k}">${label}</label><textarea id="teacher-${k}" data-field="${k}">${String(saved[k]||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</textarea></div>`).join('')}<div class="save-row"><button type="button" class="save-btn" id="teacherSave">保存</button></div></div>`;
    overlay.hidden=false;
    body.querySelector('#teacherSave').addEventListener('click',()=>save(ctx));
  }
  function save(ctx){
    const data={};body.querySelectorAll('[data-field]').forEach(t=>data[t.dataset.field]=t.value);data.updatedAt=new Date().toISOString();
    localStorage.setItem(keyFor(ctx),JSON.stringify(data)); overlay.hidden=true;
  }
  btn.hidden=!context().item;
  btn.addEventListener('click',e=>{e.stopPropagation();open();});
  close?.addEventListener('click',()=>overlay.hidden=true);
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.hidden=true;});
  window.addEventListener('clover:framechange',()=>{
    if(!stage.contains(btn))stage.appendChild(btn);
    const item=context().item;btn.hidden=!item;
  });
})();
