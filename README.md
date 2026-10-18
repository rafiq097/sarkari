# Sarkari Atlas

A static research portal for Central, Andhra Pradesh, Telangana and Karnataka government recruitment: eligibility, exam stages, syllabus, cutoffs, pay, career growth, and personal tools (My Profile, Your plan, eligibility checker, comparison, syllabus overlap, salary explorer, calendar).

No backend. Personal data (profile, bookmarks, comparison) stays in the visitor's browser.

## Run locally

```bash
npm install
npm run dev        # validates data, then starts Vite on http://localhost:5173
```

## Build and preview

```bash
npm run build      # validates data and builds to dist/
npm run preview    # serves dist/ on http://localhost:4173
```

## Deploy

Any static host works. Clean URLs need a fallback to `index.html`:

- Netlify: `public/_redirects` is already included.
- Vercel: `vercel.json` is already included.

Publish the `dist/` folder.

## Data

- Exam profiles: `src/data/exams/<jurisdiction>/<id>.json` (schema in `docs/DATA_SCHEMA.md`).
- Pay rules (DA, HRA, transport, pension, pay matrix): `src/data/pay-rules/pay-rules.json`.
- Shared labels and tags: `src/data/vocabulary.json`.
- Coverage report: `src/data/coverage.json`.
- `npm run data` validates every profile (required fields, enums, source references, dates) and builds the indexes in `src/data/generated/` (not committed).

### Adding or updating a profile

1. Read the official notification. Helper: `python -I scripts/authoring/fetch_text.py <url> [marker] [chars]`.
2. Write or edit a batch spec in `scripts/authoring/batches/` (see existing batches).
3. Run `node scripts/authoring/make-profile.mjs scripts/authoring/batches/<file>.mjs`, then `npm run data`.

Rules: official sources first, secondary sources marked `secondary`, unknown values `null` with a note in `dataQuality.gaps`. Only official dates; tentative dates only from official calendars. Status (active, recurring) is recomputed from dates in the browser, so pages age correctly.

### Updating pay rules

When DA changes, edit `daPercent`, `daEffective` and `daNote` of the rule set in `pay-rules.json`. All salary estimates update automatically.

## Project notes

- `HANDOFF.md`: current state, conventions and next steps.
- `PROGRESS.md`: progress summary and scope rules.
