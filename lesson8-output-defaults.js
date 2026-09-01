(() => {
'use strict';

const lesson = window.CLOVER_LESSON8;
if (!lesson || !Array.isArray(lesson.items)) return;

const manual = {
  '1-(1)': ['Tom was afraid of', 'her not being able', 'to catch the last train.'],
  '1-(2)': ['You can get a good seat', 'for the musical', 'providing you reserve it', 'well in advance.'],
  '1-(3)': ['There is scarcely', 'any coffee left', 'in the pot.'],
  '1-(4)': ['Please be seated', 'in the chair.'],
  '1-(5)': ['The girl with whom', 'I went to the movies', 'is not my girlfriend.'],
  '1-(6)': ['I’m tired.', 'I’d rather not go out', 'for dinner,', 'if you don’t mind.'],
  '1-(12)': ['The possibility', 'that they would go abroad this year', 'was slim.'],
  '1-(13)': ['Had he started', 'at a younger age,', 'he might have made it', 'to the Major Leagues.']
};

const starters = new Set([
  'that','who','whom','whose','which','when','where','why','if','because','while','although','though','unless',
  'before','after','with','without','from','for','to','of','in','on','at','by','as','than','instead','and','but','or'
]);

function tidy(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function splitLine(line) {
  const words = tidy(line).split(' ').filter(Boolean);
  if (words.length < 2) return words.length ? [words[0]] : [];
  if (words.length <= 4) {
    const cut = Math.max(1, Math.floor(words.length / 2));
    return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')].filter(Boolean);
  }

  const chunks = [];
  let cur = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const bare = w.toLowerCase().replace(/^[“‘(\[]+|[.,!?;:’”\])]+$/g, '');
    const remaining = words.length - i;
    if (cur.length >= 2 && starters.has(bare) && remaining >= 2) {
      chunks.push(cur.join(' '));
      cur = [];
    }
    cur.push(w);
    const punct = /[,;:]$/.test(w);
    if ((punct && cur.length >= 2) || cur.length >= 5) {
      chunks.push(cur.join(' '));
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur.join(' '));

  for (let i = chunks.length - 1; i > 0; i--) {
    if (chunks[i].split(/\s+/).length === 1) {
      chunks[i - 1] += ' ' + chunks[i];
      chunks.splice(i, 1);
    }
  }
  if (chunks.length === 1 && words.length >= 4) {
    const cut = Math.ceil(words.length / 2);
    return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')];
  }
  return chunks;
}

function makePhrases(item) {
  if (manual[item.key]) return manual[item.key].slice();
  const lines = String(item.completed || '').split(/\n+/).map(tidy).filter(Boolean);
  const phrases = lines.flatMap(splitLine).filter(Boolean);
  if (phrases.length >= 2) return phrases;
  const fallback = tidy(item.completed || item.answer || item.question);
  const words = fallback.split(' ').filter(Boolean);
  if (words.length >= 2) {
    const cut = Math.max(1, Math.ceil(words.length / 2));
    return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')].filter(Boolean);
  }
  return [fallback, 'Say it again.'].filter(Boolean);
}

for (const item of lesson.items) {
  if (item.output && Array.isArray(item.output.phrases) && item.output.phrases.length >= 2) continue;
  item.output = {
    jp: item.translation || (Array.isArray(item.translations) ? item.translations.join(' / ') : ''),
    phrases: makePhrases(item),
    generatedForLessonFlow: true
  };
}
})();
