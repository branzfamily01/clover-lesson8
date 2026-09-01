(() => {
'use strict';

const stage = document.getElementById('stage');
const lesson = window.CLOVER_LESSON8;
if (!stage || !lesson) return;

// Check〜文法整理までは「完成英文」を上部に残す。
// Back Up / Say it では暗唱の邪魔になるため、完成英文は一切残さない。
const completedSentenceStages = new Set(['check', 'why', 'wrong', 'meaning', 'grammar']);
const patchStages = new Set([...completedSentenceStages, 'output']);
const stageLabelMap = new Map([
  ['Check', 'check'],
  ['Why?', 'why'],
  ['誤答分析', 'wrong'],
  ['Meaning', 'meaning'],
  ['文法整理', 'grammar'],
  ['Back Up', 'output'],
  ['Back Up Technique', 'output']
]);
let patching = false;

const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function completedCardHtml(item) {
  return `<div class="question-card completed-projection-card">
    <div class="answer-phase-label">COMPLETED SENTENCE</div>
    <button class="audio-btn" type="button" data-audio="1" aria-label="完成英文を読み上げ">▶</button>
    <p class="question completed-projection-text">${esc(item.completed || item.answer || item.question)}</p>
  </div>`;
}

function ensureCompletedSentence(item) {
  let card = stage.querySelector('.question-card');
  if (card) {
    card.classList.add('completed-projection-card');
    let label = card.querySelector('.answer-phase-label');
    if (!label) {
      label = document.createElement('div');
      label.className = 'answer-phase-label';
      label.textContent = 'COMPLETED SENTENCE';
      card.insertBefore(label, card.firstChild);
    }
    const question = card.querySelector('.question');
    if (question) {
      question.textContent = item.completed || item.answer || item.question;
      question.classList.add('completed-projection-text');
    }
    card.querySelectorAll('.sub-question-list').forEach(node => node.remove());
    return card;
  }

  const title = stage.querySelector('.lesson-title');
  if (title) {
    title.insertAdjacentHTML('afterend', completedCardHtml(item));
    return stage.querySelector('.completed-projection-card');
  }
  return null;
}

function clearEnglishAnswerLeakageForBackUp() {
  // Back Up では「見えている英文を読めば言える」状態を禁止する。
  // 英文は Back Up の phrase-line だけに存在し、→ごとに1フレーズずつ隠れる。
  stage.querySelectorAll(
    '.question-card, .completed-projection-card, .completed, .big-answer, .choice-grid, .sub-question-list'
  ).forEach(node => node.remove());
}

function reinforceBackUp(item) {
  if (!item.output || !Array.isArray(item.output.phrases) || !item.output.phrases.length) return;

  const phrases = item.output.phrases;
  const hiddenCount = stage.querySelectorAll('.phrase.hidden-phrase').length;
  const japaneseOnly = !!stage.querySelector('.backup-wrap.backup-only-jp');

  let panel = [...stage.querySelectorAll('.panel')].find(p => p.querySelector('.label-output'));
  if (!panel) {
    panel = document.createElement('section');
    panel.className = 'panel backup-projection-panel';
    stage.querySelector('.lesson-title')?.insertAdjacentElement('afterend', panel);
  }
  if (!panel) return;

  panel.classList.add('backup-projection-panel');
  const startHidden = Math.max(0, phrases.length - hiddenCount);
  const phraseHtml = phrases.map((phrase, index) => {
    const hidden = index >= startHidden;
    return `<span class="phrase ${hidden ? 'hidden-phrase' : ''}" data-phrase-index="${index}">${hidden ? 'hidden' : esc(phrase)}</span>`;
  }).join('');

  panel.innerHTML = `
    <div class="panel-label label-output backup-title">🎙 Back Up Technique｜1フレーズずつ</div>
    <div class="backup-rule">→ を1回押すたびに、<strong>文末側から1フレーズだけ</strong>隠します。隠れた部分は暗唱して英文を再生します。</div>
    <div class="backup-wrap ${japaneseOnly ? 'backup-only-jp' : ''}">
      <div class="backup-jp">${esc(item.output.jp || item.translation || '')}</div>
      <div class="phrase-line">${phraseHtml}</div>
      <div class="backup-status">
        <span>${japaneseOnly ? '日本語だけから全文を再生' : `暗唱するフレーズ ${hiddenCount} / ${phrases.length}`}</span>
        <button class="mini-btn" type="button" data-backup-reset="1">最初に戻す</button>
      </div>
    </div>`;
}

function patch(detail) {
  if (patching || !detail || !detail.frame || detail.frame.kind !== 'item' || !detail.item) return;
  if (!patchStages.has(detail.frame.stage)) return;

  patching = true;
  try {
    if (detail.frame.stage === 'output') {
      stage.classList.remove('answer-phase');
      stage.classList.add('output-phase');
      clearEnglishAnswerLeakageForBackUp();
      reinforceBackUp(detail.item);
      return;
    }

    stage.classList.remove('output-phase');
    stage.classList.add('answer-phase');
    if (completedSentenceStages.has(detail.frame.stage)) ensureCompletedSentence(detail.item);
  } finally {
    patching = false;
  }
}

function patchFromDom() {
  if (patching) return;
  const key = stage.querySelector('.qno')?.textContent?.trim();
  const label = stage.querySelector('.stage-pill')?.textContent?.trim();
  const stageName = stageLabelMap.get(label);
  if (!key || !stageName || !patchStages.has(stageName)) return;
  const currentItem = lesson.items.find(item => item.key === key);
  if (!currentItem) return;
  patch({frame: {kind: 'item', stage: stageName}, item: currentItem});
}

window.addEventListener('clover:framechange', event => patch(event.detail));
setTimeout(patchFromDom, 0);

const style = document.createElement('style');
style.textContent = `
.answer-phase .completed-projection-card{border:2px solid rgba(239,169,53,.72);box-shadow:0 16px 38px rgba(22,41,67,.22)}
.answer-phase-label{display:inline-flex;margin:0 0 9px;padding:5px 9px;border-radius:999px;background:#fff4d8;color:#6d4a0d;font-size:clamp(11px,1vw,14px);font-weight:950;letter-spacing:.08em}
.completed-projection-text{white-space:pre-line!important;font-size:clamp(21px,2.35vw,34px)!important;line-height:1.46!important}
.backup-projection-panel{border:2px solid #cfc1ee;background:linear-gradient(180deg,#fff,#fbf8ff)}
.backup-title{font-size:clamp(17px,1.65vw,23px)!important}
.backup-rule{margin:0 0 12px;padding:10px 13px;border-radius:12px;background:#f1ebff;border:1px solid #d9cff1;color:#493d68;font-size:clamp(14px,1.35vw,19px);line-height:1.45;font-weight:850}
.backup-projection-panel .phrase-line{margin-top:2px}
.backup-projection-panel .phrase{flex:1 1 180px;min-width:min(220px,100%)}
.output-phase .completed-projection-card,.output-phase .question-card,.output-phase .completed,.output-phase .big-answer{display:none!important}
@media (max-height:700px){.completed-projection-text{font-size:clamp(18px,2vw,28px)!important}.backup-projection-panel .phrase{min-height:48px}}
`;
document.head.appendChild(style);
})();
