/**
 * Batch: RBI Grade B (DR) General, DEPR, DSIM. 2026 cycle facts from reports of the
 * RBI advertisement (secondary); exam structure as in recent RBI advertisements.
 */
const rbi = { id: 'rbi', name: 'Reserve Bank of India (Services Board)', abbreviation: 'RBI', website: 'https://opportunities.rbi.org.in' }

export default [
  {
    id: 'rbi-grade-b', name: 'RBI Officers in Grade B (Direct Recruitment): General, DEPR and DSIM', abbreviation: 'RBI Grade B', jurisdiction: 'central', sector: 'regulatory', organization: rbi,
    department: 'Reserve Bank of India',
    summary: 'Officer entry into the Reserve Bank of India in three streams: General, Economic and Policy Research (DEPR) and Statistics and Information Management (DSIM). Two written phases and an interview. One of the best-paid entry-level government jobs.',
    recruitmentMethods: ['competitive-exam', 'interview', 'document-verification'], frequency: 'Annual (usually)',
    officialLinks: [{ label: 'RBI opportunities', url: 'https://opportunities.rbi.org.in' }],
    status: { type: 'active', note: 'Usually held every year. 2026 cycle: applications 29 April to 20 May 2026; Phase I on 13 June (General) and 14 June (DEPR, DSIM); Phase II on 25 and 26 July 2026; interviews after that.', cycles: [{ cycle: 'Grade B (DR) 2026', events: [
      { event: 'Applications open', date: '2026-04-29', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-05-20', dateType: 'official', source: 's1' },
      { event: 'Phase I (General)', date: '2026-06-13', dateType: 'official', source: 's1' },
      { event: 'Phase II (General)', date: '2026-07-25', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Grade B (DR) General', group: 'Officer, Grade B', payLevel: 'RBI Grade B scale', startingBasic: 78450, responsibilities: 'Regulation, supervision, currency management, banking operations.', notes: '2026: 40 posts.' },
      { name: 'Grade B (DR) DEPR', group: 'Officer, Grade B', payLevel: 'RBI Grade B scale', startingBasic: 78450, responsibilities: 'Economic research and monetary policy analysis.', notes: '2026: 10 posts. Master\'s in economics or finance required.' },
      { name: 'Grade B (DR) DSIM', group: 'Officer, Grade B', payLevel: 'RBI Grade B scale', startingBasic: 78450, responsibilities: 'Statistics and data systems.', notes: '2026: 10 posts. Master\'s in statistics, mathematics or related required.' }],
    eligibility: {
      age: { summary: '21 to 30 years on the first day of the advertisement month (2026: as on 1 May 2026). Higher limits for M.Phil and Ph.D. holders as per the advertisement.', referenceDate: '1st of the month in the advertisement' },
      nationality: 'As per advertisement.',
      education: { summary: 'General: a bachelor\'s degree with at least 60% (50% for SC, ST, PwBD) or a master\'s with at least 55% (pass for SC, ST, PwBD). DEPR: master\'s in economics, econometrics, finance and similar. DSIM: master\'s in statistics, mathematics, econometrics or related fields, as listed in the advertisement.', finalYearAllowed: false, minMarks: '60% in graduation or 55% in PG (General stream)' },
      attempts: [{ category: 'General stream, General category', limit: '6 (as per recent advertisements)' }, { category: 'SC / ST / OBC / PwBD', limit: 'Relaxed as per advertisement' }],
      examVsPost: 'DEPR and DSIM need specific master\'s degrees; General needs the minimum percentage.',
    },
    eligibilityRules: { ageMin: 21, ageMax: 30, ageReferenceDate: '2026-05-01', minEducation: 'graduate', relaxationYears: { OBC: 3, SC: 5, ST: 5, EWS: 0, PwBD: 10 }, notes: 'General stream needs 60% in graduation or 55% in PG. DEPR/DSIM need relevant master\'s.' },
    selection: {
      stages: [
        { name: 'Phase I (objective, General stream)', type: 'objective', countsInMerit: false, papers: [{ name: 'General Awareness, English, Quantitative Aptitude, Reasoning', marks: 200, duration: '120 minutes (sectional timers)', negative: '0.25' }], notes: 'Sectional and overall cut-offs.' },
        { name: 'Phase II (General stream)', type: 'descriptive', countsInMerit: true, papers: [
          { name: 'Paper I: Economic and Social Issues (objective + descriptive)', marks: 100 },
          { name: 'Paper II: English (writing skills, descriptive)', marks: 100 },
          { name: 'Paper III: Finance and Management (objective + descriptive)', marks: 100 }] },
        { name: 'Interview', type: 'interview', countsInMerit: true, papers: [{ name: 'Interview', marks: 75 }] }],
      meritCalculation: 'Final merit on Phase II plus interview; Phase I only shortlists. DEPR and DSIM have their own stream-specific papers.', languages: 'English and Hindi (descriptive papers can be in English or Hindi as per advertisement).', documentVerification: 'At interview.', probation: 'As per RBI rules.',
    },
    syllabus: { officialLink: null, sections: [
      { stage: 'Phase II', subject: 'Economic and Social Issues', topics: ['Growth and development, Indian economy, globalisation', 'Social structure, social justice, positive discrimination', 'Inclusive growth, demographic trends'] },
      { stage: 'Phase II', subject: 'Finance and Management', topics: ['Financial system, financial markets, banking regulation, risk management', 'Basics of derivatives, corporate governance, fintech', 'Management: leadership, motivation, communication, ethics'] }] },
    syllabusTags: ['general-awareness', 'current-affairs', 'english-language', 'quantitative-aptitude', 'reasoning', 'indian-economy', 'economics-subject', 'banking-awareness', 'management', 'essay-writing', 'statistics', 'interview-personality'],
    statistics: [{ year: 2026, vacancies: 60, note: '40 General, 10 DEPR, 10 DSIM.', source: 's1' }],
    salary: { payRuleSet: 'rbi', payLevel: 'RBI Grade B', payScale: 'RBI Grade B scale', startingBasic: 78450, officialGross: null, officialGrossNote: 'Reports of the advertisement put gross pay at about Rs 1.5 lakh a month.', pension: 'NPS.', increments: 'As per RBI scale.', notes: 'RBI has its own pay structure, not the central pay matrix; DA follows RBI rules.', sources: ['s1'] },
    career: { progression: [
      { post: 'Grade B Officer (Manager)', level: 'Grade B', timeline: 'Entry', timelineType: 'official' },
      { post: 'Grade C (Assistant General Manager)', level: 'Grade C', timeline: 'After eligible service and promotion', timelineType: 'typical' },
      { post: 'Grade D (Deputy General Manager)', level: 'Grade D', timeline: 'Mid career', timelineType: 'typical' },
      { post: 'Grade E and F (General Manager, Chief GM)', level: 'Grade E to F', timeline: 'Senior', timelineType: 'typical' }],
      promotionNotes: 'Promotions by RBI selection process.', macp: 'Not applicable.', sources: ['s1'] },
    benefits: [{ item: 'RBI officer benefits', detail: 'Furnished accommodation or allowance, medical, leave fare concession, concessional loans, as per RBI rules.', conditional: true, sources: ['s1'] }],
    workLife: { postings: 'RBI offices in state capitals and major cities.', transfers: 'Periodic between RBI offices.', nature: 'Office: regulation, policy, supervision.', workload: 'Moderate to high.', publicInteraction: 'Low.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'high', competition: 'high', timePressure: 'high', technicalComplexity: 'medium', physicalRequirements: 'low', selectionUncertainty: 'high', rationale: 'Very few posts (60 in 2026) and descriptive economics and finance papers.' },
    ratings: { careerGrowth: 'high', locationFlexibility: 'medium', recruitmentRegularity: 'medium', rationale: 'Usually annual, but vacancies vary a lot.' },
    risk: { overall: 'high', factors: [{ factor: 'Very few vacancies', level: 'high', note: 'Only 60 posts in 2026.' }, { factor: 'Attempt limit', level: 'medium', note: 'Limited attempts for General category.' }] },
    sources: [['s1', 'RBI Grade B Notification 2026: 60 vacancies, dates', 'https://competition.careers360.com/articles/rbi-grade-b-notification-2026-out-registration-begins-tomorrow-for-60-vacancies', 'Careers360 (reports the RBI advertisement)', 2026, 'secondary']],
    dataQuality: { confidence: 'medium', gaps: ['Official RBI advertisement not fetched; vacancies, dates and starting basic from a secondary report.', 'Phase marks are from recent RBI advertisements.', 'Attempt limit details not confirmed for 2026.'], notes: 'Indicative.' },
  },
]
