# HANDOFF: Sarkari Atlas (govt exams portal) - read this first in a new chat

Original brief: `prompt.md`. Progress notes: `PROGRESS.md`. Data schema: `docs/DATA_SCHEMA.md`.
Research notes: `docs/research-notes/upsc.md` (UPSC 2026 and 2027 calendars).

## 1. What this is
React 19 + Vite static site (no backend). Netlify/Vercel clean URLs (`public/_redirects`, `vercel.json`).
Libraries: react-router 8, lucide-react, recharts, self-hosted fonts (@fontsource Fraunces, IBM Plex Sans/Mono).
Commands: `npm run dev` | `npm run build` | `npm run data` (validates every profile, builds `src/data/generated/*.json`; also runs before dev/build) | `npx eslint src scripts`.

## 2. Rafiq's rules (must follow)
- No subagents/workflows. Spend tokens only on useful output. Decide yourself; do not keep asking.
- Commit after each small feature: one-line message, author Rafiq only, NO Co-Authored-By line.
- Status table format from ~/.claude/CLAUDE.md (# | status | Task, bold parents, &nbsp; indented sub-rows), shown when asked and when pausing.
- UI text: plain keyboard characters (no em/en dashes, no arrows).
- Dark mode only. Warm charcoal base, vivid yellow accent `#ffd21f` (he found the earlier yellows dull). Not "AI-looking".
- Never show "verified on / accessed / research date" text in the UI (dates stay in data only).
- Data must stay valid 2 to 3 years without updates: describe yearly patterns, not "currently open". Status is computed from dates in `src/lib/status.js`.
- Accuracy over everything: official sources first; secondary marked `secondary`; unknown = null + `dataQuality.gaps`. Never guess numbers.
- Do NOT shrink data; make it scannable instead (done in UI: quick facts, bold figures, cards, stepper).
- Skip less-preferred routes: main post starting basic below Rs 20,000 (MTS, RRB Group D, ALP, Level 1 state posts) and tiny or niche cycles (e.g. AP FRO with 5 posts). List them as excluded in coverage.
- Big exams get a `guide` explainer with `quickFacts` per section.

## 3. Code map
- `src/App.jsx` routes; `src/components/Layout.jsx` header/footer; `src/lib/navigation.js` nav links.
- Pages (`src/pages`): Home, Region (central/AP/TS/KA), Directory (URL filters), ExamPage (9 tabs incl. Explainer, sticky tabs), Compare, Eligibility, Syllabus overlap, Salary, Analytics, Calendar, Sources, Coverage, Saved, Tools, Methodology, Profile (My Profile), NotFound.
- Profile tabs: `src/components/profile/*.jsx`. Rich text figures: `components/Rich.jsx`. Personal verdicts: `components/MyVerdict.jsx`, form `components/CandidateForm.jsx`, logic `lib/candidate.js`.
- Logic: `lib/data.js` (index + lazy profiles + date-aware status), `lib/eligibility.js`, `lib/salary.js` (DA/HRA/TA, fixedAdditions e.g. MSP), `lib/saved.jsx` (localStorage: bookmarks, compare, candidate profile), `lib/search.js`, `lib/stats.js`, `lib/status.js`.
- Data: `src/data/exams/<jurisdiction>/<id>.json`, `src/data/pay-rules/pay-rules.json`, `src/data/vocabulary.json`, `src/data/coverage.json` (still a stub: fill it).
- Styles: `src/index.css` (tokens), `src/styles/layout.css`, `components.css`, `pages.css`.

## 4. How to add profiles fast (use this)
1. Read the official notice: `python -I scripts/authoring/fetch_text.py <url> [marker] [chars]` (caches text in `.research-cache/<hash>.txt`; then `grep -n` / `sed -n` the .txt for key lines only).
2. Write a batch spec in `scripts/authoring/batches/<name>.mjs` (copy the style of `ap-2.mjs` or `ts-1.mjs`). The generator adds structure and shared items (pay matrix source `payMatrix`, defence pay `defencePay`, SSC calendar `sscCalendar`, UPSC calendar `upscCalendar2027`, central relaxation/reservation for central exams).
3. `node scripts/authoring/make-profile.mjs scripts/authoring/batches/<name>.mjs && npm run data` then commit.
- payRuleSet values: central-7cpc, defence-7cpc, ap-rps-2022, ts-rps-2020, bank-12bps, rbi, other.
- statistics rows need `source`; status events need `dateType` official or official-tentative.

## 5. Source access tips (saves a lot of time)
- UPSC: use `https://www.upsc.gov.in/sites/default/files/...` (bare host redirects to home). Names: `Notif-CSP-26-Engl-040226.pdf`, `Notif-IFSP-26-Engl-040226.pdf`, `Notif-ESEP-2027-Engl-160926.pdf`, `Notif-CDS-II-2026-Engl-200526.pdf`, `Notif-NDA-II-2026-Engl-200526.pdf`, `ExamNotifi_CAPF_AC_Exam_2026_Eng_20022026.pdf`, `Calendar-2026-Engl-150525.pdf`, annual reports `74thAnnualReport-2023-24-Engl-230326.pdf` (stats tables).
- SSC: `https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_<cgl|chsl|je|steno|cht>_2026.pdf`; MTS 2025 = `_mts_2025`. CPO/GD 2026 not found at this pattern.
- IBPS: homepage `https://www.ibps.in/` lists current PDFs (PO XVI: `wp-content/uploads/Detailed-Notification_CRP-PO-XVI_Final_V1_30.06.2026.pdf`).
- SBI: `https://sbi.co.in/web/careers/current-openings` lists PDFs (JA 2026 English advt; PO 2026-27 only in Hindi legacy font, numbers readable).
- RRB: PDFs blocked for scripts (HTML returned). Use secondary reports; RRB Secunderabad PDFs sometimes work.
- APPSC: list page `https://portal-psc.ap.gov.in/HomePages/RecruitmentNotifications.aspx`; PDFs at `https://psc.ap.gov.in/Documents/NotificationDocuments/<name>.pdf`.
- TGPSC: `https://websitenew.tgpsc.gov.in/directRecruitment` has `/preview/<base64>` links that return PDFs with curl (-k).
- AP SLPRB: `https://slprb.ap.gov.in/` (2026 press note is a scanned image).
- RBI opportunities page did not parse; RBI facts used a secondary report.

## 6. Done (44 profiles, all committed)
Central (24): upsc-cse (full guide), upsc-ifos, upsc-ese, upsc-cds, upsc-nda-na, upsc-capf-ac, ssc-cgl, ssc-chsl, ssc-je, ssc-stenographer, ssc-cht, ssc-cpo, ssc-gd-constable, rrb-ntpc-graduate, rrb-ntpc-undergraduate, rrb-je, rpf-si, rpf-constable, ibps-po, ibps-clerk, ibps-rrb, sbi-po, sbi-junior-associate, rbi-grade-b.
Andhra Pradesh (12): ap-power-aee, ap-tet, ap-dsc, appsc-hwo, appsc-amvi, appsc-aso-statistics, appsc-horticulture-officer, appsc-group-1 (07/2026, 166 posts, screening 24 Jan 2027), appsc-group-2 (37/2026, 686 posts), appsc-aee (27/2026), ap-police-si, ap-police-constable (SLPRB 2026).
Telangana (8): ts-police, tg-dsc, tgpsc-aee, tg-tet, tgpsc-group-1 (02/2024; SC upheld 2 Apr 2026), tgpsc-group-2, tgpsc-group-3, tgpsc-group-4.
Karnataka: none yet.
Removed by scope: ssc-mts-havaldar.

## 7. Researched but NOT yet written (facts ready)
- (WRITTEN as tgpsc-aee) TGPSC AEE (Civil) R&B, Notification 01/G/RB/2026 dated 02/06/2026: 222 posts (multi-zone), age 18-44 on 01/07/2026 (G.O.Ms.No.86 GA dt 18/05/2026 raised upper age by 10 years, 34 to 44), pay 54,220-1,33,630, apply 06/06/2026 to 13/07/2026 5 PM, exam tentatively October 2026, objective: Paper I GS & General Abilities 150 Q/150 M/150 min, Paper II Civil Engg (degree) 150 Q/300 M/150 min, total 450; min marks OC/EWS/sports 40%, BC 35%, SC/ST/PH 30%. Source: TGPSC directRecruitment page (preview link). Also 02/G/RB/2026 AEE (Electrical) exists.
- (WRITTEN as tg-tet) TG TET June 2026: notification 13 Apr 2026, apply 15-30 Apr, CBT 15-30 Jun 2026, no negative marking, fee Rs 750/1000 (Gen/OBC), Rs 700/950 (SC/ST/PwBD); TET score has 20% weightage in TRT; held twice a year. Source: Careers360 article (secondary).
- TG DSC 2026: not officially notified by mid-Oct 2026 (last DSC 2024 had 11,062 posts).
- Other APPSC 2026 notices on the list page (not profiled): ASO 20/2026, HWO 25/2026, ASWO/ATWO 26/2026, AMVI 36/2026, Horticulture 19/2026, Asst. Environmental Engineer 08/2026, Inspector of Factories 14/2026, Asst. Director 09/2026, Draughtsman 15/2026, FSO 17/2026, FBO 18/2026 (23 posts, 25,220), FRO 16/2026 (5 posts, skipped).
- TGPSC 2026 notices: DEO/Gazetted HM 03/G/SE/2026, DIET lecturers 04/G/SE/2026, Town Planning 05 and 06/G/TP/2026, TGPCB AEE and Analyst.
- NABARD Grade A 2026: not notified as of Aug 2026. RBI Grade B 2026: 60 posts (done).

## 8. Next steps (in order)
1. TS police (TGLPRB): last cycle 2022, research needed.
2. (DROPPED) Karnataka is out of scope at Rafiq's request. Focus only on AP and Telangana.
3. AP extras: AP DSC / AP TET (school education portal), APPSC ASO 20/2026, HWO.
4. Central extras worth adding: UPSC CMS, IES/ISS, CGS, EPFO EO/APFC; AFCAT; Agniveer (fixed tenure); NABARD Grade A, SEBI Grade A, LIC AAO; ISRO ICRB scientist, DRDO, BARC, GATE (as eligibility route) + major PSUs via GATE; KVS/NVS teachers, CTET, UGC NET; AIIMS NORCET; IB ACIO; EPFO SSA; FCI; ESIC.
5. (DONE) coverage.json filled; keep it updated as profiles are added.
6. (README DONE) Final browser screenshots (Chrome headless: `"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --screenshot=... --window-size=1360,1500 http://localhost:4173/...`; headless minimum width is about 500px), lint, build, stop the preview server, commit.

## 9. Known UI/data notes
- Karnataka HRA percentages under the 2024 scales are not verified; AP 10% HRA slab ceiling not verified.
- Defence pay rule set has no pension deduction (armed forces outside NPS) and adds MSP 15,500 with DA.
- Bank and RBI gross pay are not modelled (quarterly DA); `officialGross` shows where the recruiter states it (SBI JA about Rs 46,000 at metro).

## 10. Latest additions
- My Profile (`/profile`): details saved in browser, editable any time, used on exam pages (Your eligibility panel), cards (verdict badge), home strip, calendar filter, directory filter, eligibility checker.
- Your plan (`/plan`, `src/lib/recommend.js`, `src/pages/PlanPage.jsx`): ranked picks with transparent points and reasons, focus subjects, prepare-together (syllabus overlap with top pick), last-chance-by-age alerts, coming-up dates. Linked from home, profile and tools.
- Rafiq paused exam data work ("leave exams, I will start later"). Resume from section 8 when he asks.
