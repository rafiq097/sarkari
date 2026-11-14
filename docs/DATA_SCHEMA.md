# Exam Profile Data Schema

Each exam or recruitment pathway is one JSON file in `src/data/exams/<jurisdiction>/<id>.json`.
`npm run data` validates every file and builds `src/data/generated/*.json` for the UI.

Rules
- `null` means "not available / not verified". Never guess. Add the reason to `dataQuality.gaps`.
- Dates are ISO `YYYY-MM-DD` (or `YYYY-MM` / `YYYY` when only that is known).
- Money is INR per month unless the field says otherwise.
- Every section has `sources`: ids from the file's `sources` list.
- Ratings (`difficulty`, `ratings`, `risk`) are analytical judgments, not official.

## Top level

| Field | Type | Notes |
|---|---|---|
| id | string | kebab-case, unique, equals file name |
| name | string | official full name |
| abbreviation | string or null | |
| profileType | enum | `exam`, `recruitment-pathway`, `eligibility-test`, `departmental-exam` |
| jurisdiction | enum | `central`, `andhra-pradesh`, `telangana`, `karnataka` |
| sector | enum | see `vocabulary.json` -> sectors |
| organization | object | `{ id, name, abbreviation, website }` |
| department | string or null | ministry or department served |
| technical | boolean | true if a technical degree/diploma/trade is required |
| summary | string | 2 to 4 plain sentences |
| employmentType | enum | `permanent`, `short-service`, `fixed-tenure`, `contract`, `apprenticeship`, `eligibility-only` |
| recruitmentMethods | enum[] | vocabulary -> recruitmentMethods |
| frequency | string | e.g. "Annual (official calendar)", "Irregular" |
| officialLinks | `{ label, url }[]` | portal, notification, syllabus |
| status | object | see Status |
| posts | Post[] | |
| eligibility | object | see Eligibility |
| eligibilityRules | object | machine-readable envelope for the checker |
| selection | object | see Selection |
| syllabus | object | see Syllabus |
| syllabusTags | string[] | vocabulary -> syllabusTags (for overlap tool) |
| cutoffs | Cutoff[] | official only, else empty |
| statistics | Stat[] | vacancies, applicants, selected |
| rankAndAllocation | `{ text, sources }` | how ranks map to posts |
| salary | object | see Salary |
| career | object | see Career |
| benefits | `{ item, detail, conditional, sources }[]` | |
| workLife | object | `{ postings, transfers, nature, workload, publicInteraction, hazards, stability, sources }` strings |
| difficulty | object | keys below, values `low`/`medium`/`high` |
| ratings | object | `careerGrowth`, `locationFlexibility`, `recruitmentRegularity` as low/medium/high + `rationale` |
| risk | object | `{ overall, factors: [{ factor, level, note }] }` |
| sources | Source[] | |
| dataQuality | object | `{ confidence: high/medium/low, gaps: string[], notes }` |
| lastVerified | `YYYY-MM-DD` or null | Required key. The day the profile was last checked against its sources (normally the latest `accessed` date in `sources`); `null` when never checked. The UI shows "Checked <Mon YYYY>", and a "May be outdated" badge with the official link when the date is null or older than 12 months. |

| variants | Variant[] | optional; see Variants. Omit when the exam has no streams |

## Variants (optional)
For exams run in streams with different rules (for example SEBI Grade A: General, IT, Legal).
```
"variants": [ { "id": "it", "name": "IT",
                "eligibility": { "education": { "summary": "..." } },
                "eligibilityRules": { "educationFields": ["engineering-any"] },
                "posts": [ ... ], "selection": { "stages": [ ... ] },
                "syllabus": { "sections": [ ... ] }, "syllabusTags": [ ... ] } ]
```
- `id`: kebab-case, unique in the profile, used in the URL (`?variant=it`). `name`: short label for the picker. The first variant is the default.
- A variant holds only the fields that differ. Allowed: `eligibility`, `eligibilityRules`, `posts`, `selection`, `syllabus`, `syllabusTags`, `pattern`. Every other field is shared and stays at the top level.
- Merge rule (`src/lib/variants.js`): objects merge key by key at any depth, so a variant can change one nested value; arrays and plain values are replaced whole (a variant's `posts` or `stages` is its full list).
- Top-level fields describe what all streams share, or the most common stream. Tools that are not stream-aware (directory filters, compare) read the top-level fields.
- The validator checks every merged variant like a normal profile. The index stores each variant's merged `eligibilityRules` and `syllabusTags` for the eligibility checker and the syllabus overlap tool.
- If only some streams are written as variants, say so in `dataQuality.gaps`.

## Status
```
{ "type": "active | recurring | historical",
  "note": "plain text",
  "cycles": [ { "cycle": "CSE 2026",
                "events": [ { "event": "Notification", "date": "2026-01-14",
                              "dateType": "official | official-tentative",
                              "source": "s1" } ] } ] }
```
Only official dates. Tentative dates only when an official calendar says so.

## Post
`{ name, group, payLevel, startingBasic, responsibilities, ageMin, ageMax, education, notes }`
Use post-level age/education only when different from the exam envelope.

## Eligibility (text, shown on profile)
`{ age: { summary, referenceDate, relaxations: [{ category, years, note }] }, nationality, domicile, education: { summary, finalYearAllowed, minMarks }, attempts: [{ category, limit }], experience, physical, medical, other: [], examVsPost, disqualifications: [], reservation, sources }`

## eligibilityRules (for the checker)
```
{ "ageMin": 21, "ageMax": 32, "ageReferenceDate": "2026-08-01",
  "relaxationYears": { "OBC": 3, "SC": 5, "ST": 5, "EWS": 0, "PwBD": 10 },
  "minEducation": "graduate",
  "educationFields": ["any"],
  "finalYearAllowed": true,
  "gender": "any | male | female",
  "domicile": null,
  "notes": "" }
```
`minEducation`: vocabulary -> educationLevels. `educationFields`: vocabulary -> educationFields.
PwBD years are added on top of the category relaxation unless `notes` says otherwise.

## Selection
```
{ "stages": [ { "name": "Preliminary", "type": "objective | descriptive | interview | skill | physical | medical | document | ssb | merit",
                "countsInMerit": false,
                "papers": [ { "name", "marks", "questions", "duration", "negative", "qualifying", "notes" } ],
                "notes": "" } ],
  "meritCalculation", "tieBreaking", "normalization", "languages",
  "documentVerification", "probation", "sources" }
```

## Syllabus
`{ "officialLink", "sections": [ { "stage", "subject", "topics": [] } ], "supplementary": [], "sources" }`
`supplementary` is preparation advice, clearly not official.

## Cutoff
`{ year, stage, scale, values: { "UR": 0, "EWS": 0, "OBC": 0, "SC": 0, "ST": 0 }, note, source }`
Value keys use official category labels.

## Stat
`{ year, vacancies, applicants, appeared, qualifiedNextStage, interviewed, selected, note, source }`
Selection rate is computed by the UI only when `selected` and `applicants` or `appeared` exist.

## Salary
```
{ "payRuleSet": "central-7cpc | ap-rps-2022 | ts-rps-2020 | ka-7spc | bank-12bps | rbi | psu-ida | defence-7cpc | other",
  "payLevel": "Level 10", "payScale": "56100-177500",
  "startingBasic": 56100,
  "officialGross": null, "officialGrossNote": "",
  "specialAllowances": [ { "name", "detail" } ],
  "fixedAdditions": [ { "name": "Military Service Pay", "amount": 15500, "daApplies": true } ],
  "pension": "", "increments": "", "notes": "", "asOf": "2026-10", "sources": [] }
```
Gross / in-hand estimates are computed by the UI from `src/data/pay-rules/*.json`.

## Career
`{ "progression": [ { "post", "level", "timeline", "timelineType": "official | typical" } ], "promotionNotes", "departmentalExams", "macp", "sources" }`

## Guide (optional, used for big exams)
Long-form explainer shown as the first profile tab.
```
{ "sections": [ { "title": "How the exam works",
                  "paragraphs": ["..."],
                  "bullets": ["..."],
                  "table": { "columns": ["Stage", "Marks"], "rows": [["Prelims", "400"]] },
                  "quickFacts": [ { "label": "Papers", "value": "2" } ],
                  "kind": "official | explainer | preparation" } ],
  "sources": [] }
```
`kind: preparation` marks advice that is not official.

## Source
`{ id, title, url, publisher, year, type: "primary | secondary", accessed }`

## difficulty keys
`syllabusDepth`, `competition`, `timePressure`, `technicalComplexity`, `physicalRequirements`, `selectionUncertainty`, `rationale`.
