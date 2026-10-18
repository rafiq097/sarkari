/**
 * Batch: SBI PO 2026-27 and SBI Junior Associate (Customer Support & Sales) 2026.
 * JA facts from the official English advertisement; PO numbers from the official
 * Hindi advertisement (legacy font, only figures machine-readable) plus reports.
 */
const sbi = { id: 'sbi', name: 'State Bank of India (Central Recruitment and Promotion Department)', abbreviation: 'SBI', website: 'https://sbi.bank.in/web/careers/current-openings' }
const jaAdvt = 'https://sbi.bank.in/webfiles/uploads/files_2627/08/JA_2026_Detailed_Advt_Eng.pdf'
const poAdvt = 'https://sbi.bank.in/documents/77530/57941334/23062026_SBI+_+Detailed+Advt.+PO+26-27_09+-+Hindi.pdf/0f0ff4e1-2ef6-1e3f-719f-bb95ec1a2e13?t=1782216346313'

export default [
  {
    id: 'sbi-po', name: 'SBI Probationary Officers', abbreviation: 'SBI PO', jurisdiction: 'central', sector: 'banking', organization: sbi,
    department: 'State Bank of India',
    summary: 'Officer entry into India\'s largest bank. Three phases: Prelims, Mains (objective plus descriptive), and Phase III (psychometric test, group exercise and interview). Selected officers start in JMGS-I. Widely seen as the most sought-after bank PO job.',
    recruitmentMethods: ['competitive-exam', 'interview', 'document-verification'], frequency: 'Annual (SBI recruitment calendar)',
    officialLinks: [{ label: 'SBI PO 2026-27 advertisement (Hindi)', url: poAdvt }, { label: 'SBI careers', url: 'https://sbi.bank.in/web/careers/current-openings' }],
    status: { type: 'active', note: 'Held every year. 2026-27 cycle: applications 18 June to 8 July 2026, Prelims in August, Mains in September, Phase III in October to November, final result by November or December 2026.', cycles: [{ cycle: 'SBI PO 2026-27 (CRPD/PO/2026-27/09)', events: [
      { event: 'Applications open', date: '2026-06-18', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-07-08', dateType: 'official', source: 's1' },
      { event: 'Preliminary exam', date: '2026-08', dateType: 'official-tentative', source: 's1' },
      { event: 'Main exam', date: '2026-09', dateType: 'official-tentative', source: 's1' },
      { event: 'Phase III (psychometric, group exercise, interview)', date: '2026-10', dateType: 'official-tentative', source: 's1' }] }] },
    posts: [{ name: 'Probationary Officer', group: 'JMGS-I (officer)', payLevel: 'Bank scale JMGS-I', startingBasic: 48480, responsibilities: 'Branch operations, credit, customer relationships; leadership roles after probation.', notes: 'Scale 48,480-2,000/7-62,480-2,340/2-67,160-2,680/7-85,920. Advance increments, if any, as stated in the advertisement.' }],
    eligibility: {
      age: { summary: '21 to 30 years on 1 April of the advertisement year (2026-27: on 1 Apr 2026).', referenceDate: '1 April', relaxations: [{ category: 'SC / ST', years: 5 }, { category: 'OBC (non-creamy layer)', years: 3 }, { category: 'PwBD', years: 10 }, { category: 'Ex-servicemen (as per rules)', years: 5 }] },
      nationality: 'Citizen of India, or other categories as per the advertisement.',
      education: { summary: 'Graduation in any discipline. Final-year students may apply if they can show proof of passing by the date in the advertisement.', finalYearAllowed: true, minMarks: null },
      attempts: [{ category: 'General / EWS', limit: '4' }, { category: 'OBC / PwBD (General, OBC)', limit: '7' }, { category: 'SC / ST', limit: 'No limit' }],
      examVsPost: 'There is only one post (PO), but you must also meet SBI\'s conditions on CIBIL / credit history at joining.',
      other: ['Fee as per the advertisement; SC, ST and PwBD exempt.'],
    },
    eligibilityRules: { ageMin: 21, ageMax: 30, ageReferenceDate: '2026-04-01', minEducation: 'graduate', finalYearAllowed: true, relaxationYears: { OBC: 3, SC: 5, ST: 5, EWS: 0, PwBD: 10 }, notes: 'Attempt limits apply (4 for General/EWS).' },
    selection: {
      stages: [
        { name: 'Phase I: Preliminary (online)', type: 'objective', countsInMerit: false, papers: [
          { name: 'English Language', questions: 40, marks: 40, duration: '20 minutes' }, { name: 'Quantitative Aptitude', questions: 30, marks: 30, duration: '20 minutes' }, { name: 'Reasoning Ability', questions: 30, marks: 30, duration: '20 minutes' }], notes: '100 marks, 1 hour. Negative marking 0.25.' },
        { name: 'Phase II: Main (online objective + descriptive)', type: 'objective', countsInMerit: true, papers: [
          { name: 'Objective tests: reasoning and computer aptitude, data analysis and interpretation, general/economy/banking awareness, English', marks: 200 },
          { name: 'Descriptive test: letter writing and essay (English)', marks: 50, duration: '30 minutes' }] },
        { name: 'Phase III: psychometric test, group exercise and interview', type: 'interview', countsInMerit: true, papers: [{ name: 'Group exercise + interview', marks: 50 }], notes: 'The psychometric test profile is used in the interview.' }],
      meritCalculation: 'Final merit combines Phase II (Mains) and Phase III marks; Prelims is not counted. Recent advertisements weighted Mains and Phase III 75:25.', languages: 'English and Hindi, except English papers.', documentVerification: 'At Phase III and joining.', probation: '2 years, with in-house training.',
    },
    syllabus: { officialLink: poAdvt, sections: [{ stage: 'Prelims and Mains', subject: 'Tests', topics: ['English: reading comprehension, grammar, vocabulary', 'Quantitative aptitude and data analysis and interpretation', 'Reasoning and computer aptitude', 'General, economy and banking awareness', 'Descriptive English: letter and essay'] }] },
    syllabusTags: ['english-language', 'quantitative-aptitude', 'reasoning', 'data-interpretation', 'banking-awareness', 'current-affairs', 'indian-economy', 'computer-awareness', 'essay-writing', 'interview-personality'],
    statistics: [{ year: 2026, vacancies: 1500, note: 'Advertisement CRPD/PO/2026-27/09 (regular plus backlog).', source: 's1' }],
    rankAndAllocation: { text: 'Selected candidates are posted by SBI to circles across India based on its needs; preferences may be sought but are not binding.' },
    salary: { payRuleSet: 'bank-12bps', payLevel: 'JMGS-I', payScale: '48,480 to 85,920', startingBasic: 48480, pension: 'NPS.', increments: 'As per the scale.', notes: 'Bank DA changes quarterly; SBI also gives allowances and perquisites as per its rules. Gross pay is not estimated here.' },
    career: { progression: [
      { post: 'Probationary Officer / Assistant Manager', level: 'JMGS-I', timeline: 'Entry', timelineType: 'official' },
      { post: 'Deputy Manager', level: 'MMGS-II', timeline: 'After eligible service and promotion test', timelineType: 'typical' },
      { post: 'Manager / Chief Manager', level: 'MMGS-III / SMGS-IV', timeline: 'Mid career', timelineType: 'typical' },
      { post: 'AGM to Managing Director', level: 'SMGS-V and above', timeline: 'By selection', timelineType: 'typical' }],
      promotionNotes: 'SBI has a fast-track promotion policy for officers; promotions depend on tests, interviews and performance.', macp: 'Not applicable.', sources: ['s1'] },
    benefits: [{ item: 'SBI officer benefits', detail: 'Leased accommodation, medical, leave fare concession, concessional staff loans, as per SBI rules.', conditional: true, sources: ['s1'] }],
    workLife: { postings: 'Any SBI branch or office in India; rural postings are common early.', transfers: 'Regular, including inter-circle.', nature: 'Branch and office.', workload: 'High; targets and long hours.', publicInteraction: 'Very high.', hazards: 'Low.', stability: 'High.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'high', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'high', rationale: 'Fewer posts than IBPS PO (about 1,500 to 2,000) with a tougher Mains and an attempt limit.' },
    ratings: { careerGrowth: 'high', locationFlexibility: 'low', recruitmentRegularity: 'high', rationale: 'Annual; strong career ladder in the largest bank.' },
    risk: { overall: 'medium', factors: [{ factor: 'Attempt limit', level: 'medium', note: '4 attempts for General/EWS.' }, { factor: 'Workload', level: 'medium', note: 'Sales and compliance pressure.' }] },
    guide: { sections: [{ title: 'Three phases', kind: 'explainer', quickFacts: [{ label: 'Posts 2026-27', value: '1,500' }, { label: 'Age', value: '21 to 30' }, { label: 'Attempts (General)', value: '4' }],
      paragraphs: ['Phase I screens. Phase II (Mains) has a 200-mark objective test and a 50-mark descriptive test in English. Phase III is a psychometric test, a group exercise and an interview. Final merit combines Phases II and III only.'],
      bullets: ['SBI PO has an attempt limit; IBPS PO does not.', 'SBI pay follows bank scales, not the central pay matrix.'] }] },
    sources: [['s1', 'SBI PO 2026-27 detailed advertisement CRPD/PO/2026-27/09 (Hindi)', poAdvt, 'State Bank of India', 2026], ['s2', 'SBI PO 2026 notification released (1,500 posts)', 'https://www.amarujala.com/jobs/government-jobs/sbi-po-recruitment-2026-notification-released-registration-started-apply-online-till-july-8-check-vacancy-2026-06-18', 'Amar Ujala', 2026, 'secondary']],
    dataQuality: { confidence: 'medium', gaps: ['Only the Hindi advertisement was available, in a legacy font; marks for each Mains test and the exact merit weightage are from earlier SBI PO advertisements, not re-read for 2026-27.', 'Starting basic with advance increments not confirmed.'], notes: 'Dates, age, scale and vacancies confirmed.' },
  },
  {
    id: 'sbi-junior-associate', name: 'SBI Junior Associates (Customer Support and Sales)', abbreviation: 'SBI Clerk', jurisdiction: 'central', sector: 'banking', organization: sbi,
    department: 'State Bank of India',
    summary: 'Clerical-cadre recruitment in SBI, state by state: you apply for one state and must know its local language. Online Prelims and Mains, then a local language test. Starting basic Rs 26,730; SBI states total starting pay of about Rs 46,000 a month at a metro.',
    recruitmentMethods: ['competitive-exam', 'skill-test', 'document-verification'], frequency: 'Annual (SBI recruitment calendar)',
    officialLinks: [{ label: 'JA 2026 advertisement', url: jaAdvt }],
    status: { type: 'active', note: 'Held every year. 2026 cycle: Prelims tentatively September 2026 and Mains November 2026.', cycles: [{ cycle: 'SBI JA 2026', events: [
      { event: 'Preliminary exam', date: '2026-09', dateType: 'official-tentative', source: 's1' },
      { event: 'Main exam', date: '2026-11', dateType: 'official-tentative', source: 's1' }] }] },
    posts: [{ name: 'Junior Associate (Customer Support and Sales)', group: 'Clerical cadre', payLevel: 'SBI clerical scale', startingBasic: 26730, responsibilities: 'Counter services, cash, accounts, customer support and product sales.', notes: 'No inter-state transfer for 5 years.' }],
    eligibility: {
      age: { summary: '20 to 28 years on 1 April 2026.', referenceDate: '1 April', relaxations: [{ category: 'SC / ST', years: 5 }, { category: 'OBC (non-creamy layer)', years: 3 }, { category: 'PwBD', years: 10 }, { category: 'Trained SBI apprentices (engaged on or after 1 Jan 2022)', years: null, note: 'As per the advertisement.' }] },
      nationality: 'Indian citizen.',
      domicile: 'You apply for one state or UT only and must be proficient in its local language (Telugu or Urdu for Telangana, Telugu for Andhra Pradesh, Kannada for Karnataka). A language test is held after Mains unless your Class 10 or 12 marksheet shows the language.',
      education: { summary: 'Graduation in any discipline. Final-year students may apply with proof of passing by the date in the advertisement.', finalYearAllowed: true, minMarks: null },
      attempts: [{ category: 'All', limit: 'Once per recruitment project' }],
      examVsPost: 'Vacancies are state-wise; you compete only within the state you choose.',
      disqualifications: ['Failing the local language test means no appointment.'],
    },
    eligibilityRules: { ageMin: 20, ageMax: 28, ageReferenceDate: '2026-04-01', minEducation: 'graduate', finalYearAllowed: true, relaxationYears: { OBC: 3, SC: 5, ST: 5, EWS: 0, PwBD: 10 }, notes: 'Local language proficiency of the chosen state is required.' },
    selection: {
      stages: [
        { name: 'Preliminary (online)', type: 'objective', countsInMerit: false, papers: [
          { name: 'English Language', questions: 30, marks: 30, duration: '20 minutes', negative: '0.25' }, { name: 'Numerical Ability', questions: 35, marks: 35, duration: '20 minutes', negative: '0.25' }, { name: 'Reasoning Ability', questions: 35, marks: 35, duration: '20 minutes', negative: '0.25' }], notes: '100 marks, 1 hour. No sectional minimum; about 10 times the vacancies go to Mains by aggregate.' },
        { name: 'Main (online)', type: 'objective', countsInMerit: true, papers: [
          { name: 'General / Financial Awareness', questions: 50, marks: 50, duration: '35 minutes', negative: '0.25' }, { name: 'General English', questions: 40, marks: 40, duration: '35 minutes', negative: '0.25' },
          { name: 'Quantitative Aptitude', questions: 50, marks: 50, duration: '45 minutes', negative: '0.25' }, { name: 'Reasoning Ability and Computer Aptitude', questions: 50, marks: 60, duration: '45 minutes', negative: '0.25' }], notes: '190 questions, 200 marks, 2 hours 40 minutes. Minimum aggregate and sectional marks set by the bank (5% relaxation for reserved categories). SBI apprentices get 5 bonus marks.' },
        { name: 'Local language test', type: 'skill', countsInMerit: false, notes: 'Qualifying; waived if Class 10 or 12 records show the language.' }],
      meritCalculation: 'Final selection on Mains marks, state-wise and category-wise.', languages: 'English, Hindi and the regional language as per the advertisement.', documentVerification: 'Before joining.', probation: '6 months, as per SBI rules.',
    },
    syllabus: { officialLink: jaAdvt, sections: [{ stage: 'Prelims and Mains', subject: 'Tests', topics: ['English', 'Numerical / quantitative aptitude', 'Reasoning and computer aptitude', 'General and financial awareness'] }] },
    syllabusTags: ['english-language', 'quantitative-aptitude', 'reasoning', 'computer-awareness', 'banking-awareness', 'current-affairs', 'telugu-language', 'kannada-language'],
    statistics: [{ year: 2026, vacancies: 7680, note: 'Regular vacancies across all states (backlog listed separately).', source: 's1' }],
    salary: { payRuleSet: 'bank-12bps', payLevel: 'SBI clerical scale', payScale: '24,050 to 64,480', startingBasic: 26730, officialGross: 46000, officialGrossNote: 'SBI states total starting emoluments of about Rs 46,000 a month at a metro such as Mumbai, including DA and allowances (rate at the time of the advertisement).', pension: 'NPS.', increments: 'As per the scale; graduates get two advance increments (24,050 + 2 = 26,730).' },
    career: { progression: [
      { post: 'Junior Associate', level: 'Clerical', timeline: 'Entry', timelineType: 'official' },
      { post: 'Officer (JMGS-I) via internal promotion', level: 'JMGS-I', timeline: 'After eligible service and promotion test', timelineType: 'typical' }],
      promotionNotes: 'Internal promotion to officer is a common path in SBI.', macp: 'Not applicable.', sources: ['s1'] },
    benefits: [{ item: 'SBI staff benefits', detail: 'Medical, leave fare concession, staff loans as per SBI rules.', conditional: true, sources: ['s1'] }],
    workLife: { postings: 'Branches in your chosen state.', transfers: 'Within the state; no inter-state transfer for 5 years.', nature: 'Counter and back office.', workload: 'High footfall at urban branches.', publicInteraction: 'Very high.', hazards: 'Low.', stability: 'High.' },
    difficulty: { syllabusDepth: 'low', competition: 'high', timePressure: 'high', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Simple syllabus, tight timers, very large applicant pool, state-wise merit.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'high', recruitmentRegularity: 'high', rationale: 'You stay in your chosen state; internal promotion to officer is possible.' },
    risk: { overall: 'low', factors: [{ factor: 'Language test', level: 'low', note: 'Required unless school records show the language.' }] },
    sources: [['s1', 'SBI Junior Associates (Customer Support & Sales) 2026 detailed advertisement', jaAdvt, 'State Bank of India', 2026]],
    dataQuality: { confidence: 'high', gaps: ['State-wise vacancy figures for AP, Telangana and Karnataka not reproduced.', 'Application dates not recorded.'], notes: 'From the official English advertisement.' },
  },
]
