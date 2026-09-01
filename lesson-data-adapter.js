(() => {
  'use strict';
  const lesson = window.CLOVER_LESSON8;
  if (!lesson || !Array.isArray(lesson.items)) throw new Error('CLOVER_LESSON8 data missing');

  const hintLead = [
    'Which part gives you the clue?',
    'What rule or pattern do you remember?',
    'How does that decide the form?'
  ];

  const fallbackPath = {
    1: ['Grammar & Usage'],
    2: ['Words & Phrases'],
    3: ['Words & Phrases'],
    4: ['Error Correction'],
    5: ['Word Order']
  };

  lesson.items = lesson.items.map((item) => {
    const why = Array.isArray(item.why) ? item.why.join(' / ') : (item.why || item.decision || item.focus || '');
    const wrong = Array.isArray(item.wrong) ? item.wrong.join(' / ') : (item.wrong || '形・意味・語法のどこが合わないかを確認しよう。');
    const jpHints = Array.isArray(item.hints) ? item.hints : [];
    const hints = jpHints.map((h, n) => `${hintLead[Math.min(n, hintLead.length - 1)]}\n${h}`);
    const phrases = item.output && Array.isArray(item.output.phrases) ? item.output.phrases.slice() : [];
    const focus = String(item.focus || item.sectionName || '').trim();
    const first = focus ? focus.split(/[｜/]/)[0].trim() : '';
    const path = first ? [first, focus].filter((x, i, a) => x && a.indexOf(x) === i) : (fallbackPath[item.section] || ['Grammar']);

    return Object.assign({}, item, {
      section: String(item.section),
      kind: item.type || item.kind || 'practice',
      problem: item.question || item.problem || '',
      answer: item.completed || item.answer || '',
      meaning: item.translation || (Array.isArray(item.translations) ? item.translations.join(' / ') : '') || item.meaning || '',
      why,
      watch: wrong,
      hints,
      chunks: phrases.length ? phrases : [item.completed || item.answer || ''],
      mapPath: path,
      options: Array.isArray(item.choices) ? item.choices : []
    });
  });
})();
