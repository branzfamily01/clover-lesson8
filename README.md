# Clover Lesson 8

Status: `review`.

Clover Lesson 8 is rebuilt on the same **English Classroom Engine v1** used by the Evergreen Gold Standard lessons.

## Active entry points
- Teacher: `index.html`
- Student: `student-index.html`

## Active lesson layer
- `lesson-data.js` — authoritative 37-question source data
- `lesson-data-v1.js` — Engine v1 adapter
- `lesson-references-v1.js` — lesson-specific Concept MAP
- `lesson08-learning-v1.js` — Final Check / Back Up Challenge
- `lesson08-enhance-v1.js` — MAP, hint highlighting, question diagrams, Now-path
- `lesson08-v1.css` — classroom visual layer

## Shared runtime
Loaded from `branzfamily01/english-classroom`:
- `_engine/v1/engine.css`
- `_engine/v1/engine.js`
- `_engine/v1/audio.js`
- Teacher entry only: `_teacher/v1/teacher.js`

## Lesson flow
`Problem → Small Step Hint(s) → Check → Why? → Watch out → Meaning → Say it → Final Check`

Back Up Technique hides **one phrase at a time from the end**. Student entry does not load the Teacher layer.

## Gold Standard parity target
The UX target is the current Evergreen Lesson8 / Lesson9 / Lesson10 implementation: same screen flow, same shared runtime, same teacher/student separation, same MAP access pattern, same one-phrase-at-a-time Back Up behavior, and the same retrieval-style Final Check. Clover keeps its own content and grammar map.

## Source policy
Clover `L08_本文` / `L08_解答` remain authoritative for questions, choices, answers, completed sentences, and official translations. Evergreen Lesson8/9/10 are reference implementations for classroom UX only.

## Legacy artifacts
The previous standalone UI files (`app.js`, `layout-fix.js`, `styles.css`, `lesson08-enhance.js`, etc.) remain inactive review-history artifacts. The active teacher/student entry points do not load them.

## Release gate
This rebuild remains `review`. Teacher approval is required before `ready`. Student production publication is a separate explicit step and has not been performed.
