# Clover Lesson 8

Status: `review`.

Clover Lesson 8 is now rebuilt on the same **English Classroom Engine v1** used by the Evergreen Gold Standard lessons.

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

Shared runtime is loaded from `branzfamily01/english-classroom`:

- `_engine/v1/engine.css`
- `_engine/v1/engine.js`
- `_engine/v1/audio.js`
- Teacher entry only: `_teacher/v1/teacher.js`

## Lesson flow

`Problem → Small Step Hint(s) → Check → Why? → Watch out → Meaning → Say it → Final Check`

Back Up Technique hides **one phrase at a time from the end**. Student entry does not load the Teacher layer.

## Legacy artifacts

The previous standalone UI files (`app.js`, `layout-fix.js`, `styles.css`, `lesson08-enhance.js`, etc.) remain only as inactive review-history artifacts. The active teacher/student entry points do not load them.

Student production release is not performed from this repository by this rebuild.
