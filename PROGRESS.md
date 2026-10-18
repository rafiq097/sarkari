# Research and build progress

Resume from this file if work spans sessions. Research notes live in docs/research-notes/.

## Done
- UI: all pages, tools, theme, date-aware status (src/lib/status.js)
- Pay rules: src/data/pay-rules/pay-rules.json (Central DA 60% from 1 Jan 2026; AP 41.86%; TS 40.04%; KA 15.75%)
- Profiles: central/upsc-cse (full explainer)

## Writing rules
- Official sources first; secondary marked. Never guess; use null + dataQuality.gaps.
- Durable wording: describe yearly patterns, not "currently open".
- No "verified on" text in UI.
- Big exams get a `guide` explainer.

## Source access tips
- UPSC PDFs: use https://www.upsc.gov.in/sites/default/files/... (the www host serves files; bare host redirects to home).
- Helper: scratchpad tools/gettext.py URL [marker] [chars] caches text to downloads/<hash>.txt

## Pending (in order)
1. Big-exam explainers: UPSC ESE, IFoS, CDS, NDA, CAPF; SSC CGL, CHSL; IBPS PO, SBI PO, RBI Grade B; RRB NTPC; APPSC Group 1, 2; TGPSC Group 1, 2; KPSC KAS
2. Remaining central profiles (SSC, railways, banking, insurance, regulators, defence, CAPF, science, PSUs, teaching, others)
3. Andhra Pradesh, Telangana, Karnataka profiles
4. coverage.json, README, final audit
