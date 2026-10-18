/**
 * Batch: IBPS PO (CRP PO/MT-XVI, official notice of 30 Jun 2026).
 */
const ibps = { id: 'ibps', name: 'Institute of Banking Personnel Selection', abbreviation: 'IBPS', website: 'https://www.ibps.in' }
const poNotice = 'https://www.ibps.in/wp-content/uploads/Detailed-Notification_CRP-PO-XVI_Final_V1_30.06.2026.pdf'

export default [
  {
    id: 'ibps-po', name: 'Common Recruitment Process for Probationary Officers / Management Trainees', abbreviation: 'IBPS PO', jurisdiction: 'central', sector: 'banking', organization: ibps,
    department: '11 public sector banks: Bank of Baroda, Bank of India, Bank of Maharashtra, Canara Bank, Central Bank of India, Indian Bank, Indian Overseas Bank, Punjab National Bank, Punjab & Sind Bank, UCO Bank, Union Bank of India',
    summary: 'One common exam for Probationary Officer / Management Trainee jobs in 11 public sector banks. Prelims, Mains (objective plus descriptive), a non-qualifying Personality Test, then an interview. Final merit is Mains and interview in an 80:20 ratio. Officers start in JMGS-I with a basic pay of Rs 48,480.',
    recruitmentMethods: ['competitive-exam', 'interview', 'document-verification'], frequency: 'Annual (IBPS calendar)',
    officialLinks: [{ label: 'CRP PO/MT-XVI notification', url: poNotice }, { label: 'IBPS website', url: 'https://www.ibps.in' }],
    status: { type: 'active', note: 'Held every year. Usual pattern: notice around July, Prelims in August, Mains in October, interviews November to December, provisional allotment in January. CRP XVI fills vacancies of 2027-28.', cycles: [{ cycle: 'CRP PO/MT-XVI (vacancies 2027-28)', events: [
      { event: 'Notification', date: '2026-06-30', dateType: 'official', source: 's1' },
      { event: 'Preliminary exam', date: '2026-08', dateType: 'official-tentative', source: 's1' },
      { event: 'Main exam', date: '2026-10', dateType: 'official-tentative', source: 's1' },
      { event: 'Personality Test', date: '2026-11', dateType: 'official-tentative', source: 's1' },
      { event: 'Provisional allotment', date: '2027-01', dateType: 'official-tentative', source: 's1' }] }] },
    posts: [{ name: 'Probationary Officer / Management Trainee', group: 'JMGS-I (officer)', payLevel: 'Bank scale JMGS-I', startingBasic: 48480, responsibilities: 'Branch banking, credit, operations and customer service; a 2-year probation with rotation across functions.', notes: 'Basic Rs 48,480-2,000/7-62,480-2,340/2-67,160-2,680/7-85,920, plus bank allowances.' }],
    eligibility: {
      age: { summary: '20 to 30 years on 1 July of the notice year (CRP XVI: born 2 Jul 1996 to 1 Jul 2006, both inclusive).', referenceDate: '1 July (as per notice)', relaxations: [
        { category: 'SC / ST', years: 5 }, { category: 'OBC (non-creamy layer)', years: 3 }, { category: 'PwBD', years: 10 },
        { category: 'Ex-servicemen / commissioned officers incl. ECO/SSCO', years: 5 }, { category: 'Persons affected by 1984 riots', years: 5 }] },
      nationality: 'Citizen of India, or other categories as per the notice.',
      education: { summary: 'A degree (graduation) in any discipline, or equivalent, by the closing date of registration. Candidates must state the percentage of marks in graduation.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      other: ['Pre-Examination Training is offered for SC, ST, minority and PwBD candidates.', 'A healthy CIBIL record is expected at joining as per bank policy.'],
      examVsPost: 'You rank banks in order of preference; IBPS provisionally allots one bank based on merit, category and preference. The bank then decides the posting.',
      disqualifications: ['Changing category or eligibility details after registration is not allowed.'],
      reservation: 'Central reservation (SC, ST, OBC-NCL, EWS) and PwBD, as per the bank-wise vacancy table in the notice.',
    },
    eligibilityRules: { ageMin: 20, ageMax: 30, ageReferenceDate: '2026-07-01', minEducation: 'graduate', relaxationYears: { OBC: 3, SC: 5, ST: 5, EWS: 0, PwBD: 10 } },
    selection: {
      stages: [
        { name: 'Preliminary (online)', type: 'objective', countsInMerit: false, papers: [
          { name: 'English Language', marks: 30, questions: 30, duration: '20 minutes', negative: '0.25 of the marks' },
          { name: 'Quantitative Aptitude', marks: 30, questions: 35, duration: '20 minutes', negative: '0.25' },
          { name: 'Reasoning Ability', marks: 40, questions: 35, duration: '20 minutes', negative: '0.25' }], notes: '100 questions, 100 marks, 60 minutes. Minimum cut-off in each section.' },
        { name: 'Main (online)', type: 'objective', countsInMerit: true, papers: [
          { name: 'Reasoning', marks: 60, questions: 40, duration: '45 minutes', negative: '0.25' },
          { name: 'General / Economy / Banking / Digital / Financial Awareness incl. RBI circulars', marks: 60, questions: 50, duration: '35 minutes', negative: '0.25' },
          { name: 'English Language', marks: 20, questions: 40, duration: '35 minutes', negative: '0.25' },
          { name: 'Data Analysis and Interpretation', marks: 60, questions: 40, duration: '45 minutes', negative: '0.25' },
          { name: 'Descriptive: essay and comprehension (English)', marks: 25, questions: 2, duration: '30 minutes', notes: 'May be scored by a validated automated mechanism.' }], notes: '170 objective questions (200 marks, 160 minutes) plus the descriptive paper. Minimum score in each test and in total.' },
        { name: 'Personality Test (self-report)', type: 'interview', countsInMerit: false, notes: 'Non-qualifying, but mandatory to attend the interview. Your personality profile is shown to the interview panel.' },
        { name: 'Common Interview', type: 'interview', countsInMerit: true, papers: [{ name: 'Interview', marks: 100, notes: 'Minimum 40% (35% for SC, ST, OBC, PwBD).' }] }],
      meritCalculation: 'Final score = Main exam and interview in an 80:20 weightage. Prelims marks are not counted. Main scores are not shared before interviews finish.', tieBreaking: 'As specified in the notice.', normalization: 'Applied where tests run in multiple shifts.',
      languages: 'English and Hindi, except the English papers.', documentVerification: 'At the interview and at the allotted bank.', probation: '2 years in the allotted bank.',
    },
    syllabus: { officialLink: poNotice, sections: [
      { stage: 'Prelims', subject: 'Three tests', topics: ['English: reading comprehension, cloze, error detection, para-jumbles, vocabulary', 'Quantitative aptitude: simplification, number series, quadratic equations, arithmetic, data interpretation', 'Reasoning: puzzles, seating arrangement, syllogism, inequality, coding, blood relations, direction'] },
      { stage: 'Mains', subject: 'Four tests and descriptive', topics: ['Reasoning (advanced puzzles, input-output, logical reasoning)', 'General, economy and banking awareness, digital and financial awareness, RBI circulars', 'English language (reading-heavy)', 'Data analysis and interpretation', 'Essay and comprehension on economic and social issues, banking and technology trends, current events, ethics'] }],
      supplementary: ['Banking awareness and current affairs of the last 6 to 8 months matter most for Mains GA.'] },
    syllabusTags: ['english-language', 'quantitative-aptitude', 'reasoning', 'data-interpretation', 'banking-awareness', 'current-affairs', 'indian-economy', 'computer-awareness', 'essay-writing', 'interview-personality'],
    statistics: [],
    rankAndAllocation: { text: 'IBPS ranks candidates on the combined Mains and interview score and provisionally allots banks by merit, category and the bank preference you give. Allotment is subject to vacancies reported by banks. A reserve list may be used if vacancies remain.' },
    salary: { payRuleSet: 'bank-12bps', payLevel: 'JMGS-I', payScale: '48,480 to 85,920', startingBasic: 48480, officialGross: null, pension: 'NPS for those joining after 1 Apr 2010.', increments: 'Stage increments of Rs 2,000 (7 stages), Rs 2,340 (2) and Rs 2,680 (7) as per the scale.', notes: 'Bank DA changes every quarter with CPI, and HRA and other allowances follow the 12th Bipartite Settlement and bank rules, so gross pay is not estimated here.', specialAllowances: [{ name: 'Allowances and perquisites', detail: 'DA, HRA or leased accommodation, special allowance, and other perquisites as per the allotted bank.' }] },
    career: { progression: [
      { post: 'Probationary Officer / Assistant Manager', level: 'JMGS-I', timeline: 'Entry; 2-year probation', timelineType: 'official' },
      { post: 'Manager', level: 'MMGS-II', timeline: 'Promotion process after a minimum eligible service', timelineType: 'typical' },
      { post: 'Senior Manager', level: 'MMGS-III', timeline: 'Mid career', timelineType: 'typical' },
      { post: 'Chief Manager / AGM / DGM / GM', level: 'SMGS-IV to TEGS-VII', timeline: 'Senior, by promotion', timelineType: 'typical' }],
      promotionNotes: 'Bank promotions use written tests, interviews and performance appraisals, with minimum service in each scale. Speed varies by bank.', macp: 'Not applicable (bank pay scales).', sources: ['s1'] },
    benefits: [{ item: 'Bank officer benefits', detail: 'Leased accommodation or HRA, medical aid, leave fare concession, concessional staff loans, as per bank rules.', conditional: true, sources: ['s1'] }],
    workLife: { postings: 'Any branch of the allotted bank across India, including rural branches early on.', transfers: 'Every 2 to 3 years, including inter-state.', nature: 'Branch and office work.', workload: 'High: sales targets, recovery and compliance work.', publicInteraction: 'Very high.', hazards: 'Low.', stability: 'High.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'high', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Graduate-level aptitude under tight sectional timers, sectional cut-offs, and lakhs of applicants for a few thousand posts.' },
    ratings: { careerGrowth: 'high', locationFlexibility: 'low', recruitmentRegularity: 'high', rationale: 'Annual. Clear officer ladder, but transfers across states are common.' },
    risk: { overall: 'medium', factors: [
      { factor: 'Sectional cut-offs', level: 'medium', note: 'A weak section can eliminate you even with a good total.' },
      { factor: 'Workload and transfers', level: 'medium', note: 'Targets and inter-state transfers are part of the job.' },
      { factor: 'Irregular recruitment', level: 'low', note: 'Held every year.' }] },
    guide: { sections: [
      { title: 'Four steps to a bank PO job', kind: 'official', quickFacts: [{ label: 'Banks', value: '11' }, { label: 'Final merit', value: 'Mains 80 : Interview 20' }, { label: 'Starting basic', value: 'Rs 48,480' }],
        paragraphs: ['Prelims (1 hour) only shortlists. Mains decides most of your rank. From CRP XVI, everyone who clears Mains also takes a self-report Personality Test; it does not add marks, but you must take it to be interviewed, and the panel sees your profile. The interview is out of 100 and counts for 20% of the final score.'] },
      { title: 'Sectional timers and cut-offs', kind: 'official', quickFacts: [{ label: 'Prelims', value: '3 x 20 minutes' }, { label: 'Wrong answer', value: 'minus 0.25' }],
        paragraphs: ['Every test is separately timed, and you must clear a minimum in each test, in both Prelims and Mains. Spending extra time on a strong section is not possible.'] },
      { title: 'Common confusions', kind: 'explainer', bullets: ['IBPS does not employ you; it allots you to one of 11 banks, which then posts you.', 'Prelims marks are not used in the final merit.', 'Bank pay does not follow the central pay matrix; DA changes every quarter.', 'SBI PO is a separate exam run by SBI, not IBPS.'] }] },
    sources: [['s1', 'Detailed Notification: CRP PO/MT-XVI (vacancies of 2027-28)', poNotice, 'Institute of Banking Personnel Selection', 2026]],
    dataQuality: { confidence: 'high', gaps: ['Total vacancies were revised by addenda; final figure not recorded.', 'Official cutoffs not collected.', 'Gross salary not estimated (quarterly bank DA).'], notes: 'Scheme, age, pay scale and merit rules from the official notice.' },
  },
]
