/**
 * Batch: IBPS Clerk (CRP CSA-XVI) and IBPS RRB (CRP RRB-XV). Cycle figures from
 * reports of the 2026 notices (secondary); structure as in recent IBPS notices.
 */
const ibps = { id: 'ibps', name: 'Institute of Banking Personnel Selection', abbreviation: 'IBPS', website: 'https://www.ibps.in' }

export default [
  {
    id: 'ibps-clerk', name: 'Common Recruitment Process for Customer Service Associates (Clerks)', abbreviation: 'IBPS Clerk', jurisdiction: 'central', sector: 'banking', organization: ibps,
    department: '11 public sector banks',
    summary: 'State-wise recruitment of clerks (Customer Service Associates) for 11 public sector banks. Prelims and Mains, no interview, and a local language proficiency test for the state you apply in.',
    recruitmentMethods: ['competitive-exam', 'skill-test', 'document-verification'], frequency: 'Annual (IBPS calendar)',
    officialLinks: [{ label: 'IBPS website', url: 'https://www.ibps.in' }],
    status: { type: 'active', note: 'Held every year. 2026 cycle (CSA-XVI): applications 1 to 21 August 2026, Prelims tentatively 10 to 11 October 2026, Mains tentatively 27 December 2026.', cycles: [{ cycle: 'CRP CSA-XVI', events: [
      { event: 'Applications open', date: '2026-08-01', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-08-21', dateType: 'official', source: 's1' },
      { event: 'Preliminary exam', date: '2026-10-10', dateType: 'official-tentative', source: 's1' },
      { event: 'Main exam', date: '2026-12-27', dateType: 'official-tentative', source: 's1' }] }] },
    posts: [{ name: 'Customer Service Associate (Clerk)', group: 'Clerical cadre', payLevel: 'Bank clerical scale', startingBasic: 24050, responsibilities: 'Cash, deposits, customer service and back office in a branch.', notes: 'Scale 24,050 to 64,480 (12th Bipartite Settlement).' }],
    eligibility: {
      age: { summary: 'Usually 20 to 28 years on the date in the notice.', referenceDate: 'As per notice' },
      nationality: 'Citizen of India or other categories as per notice.',
      domicile: 'Apply for one state or UT; proficiency in its official language is required (Telugu for AP and Telangana, Kannada for Karnataka).',
      education: { summary: 'A degree in any discipline; computer literacy (certificate, or computers as a subject) as per the notice.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
    },
    eligibilityRules: { ageMin: 20, ageMax: 28, minEducation: 'graduate', relaxationYears: { OBC: 3, SC: 5, ST: 5, EWS: 0, PwBD: 10 }, notes: 'State language proficiency needed.' },
    selection: {
      stages: [
        { name: 'Preliminary (online)', type: 'objective', countsInMerit: false, papers: [{ name: 'English, Numerical Ability, Reasoning', marks: 100, questions: 100, duration: '60 minutes (sectional timers)', negative: '0.25' }] },
        { name: 'Main (online)', type: 'objective', countsInMerit: true, papers: [{ name: 'General/Financial Awareness, General English, Reasoning and Computer Aptitude, Quantitative Aptitude', marks: 200, negative: '0.25' }] },
        { name: 'Language Proficiency Test', type: 'skill', countsInMerit: false }],
      meritCalculation: 'Final provisional allotment on Mains marks, state-wise.', languages: 'English, Hindi and regional languages as per notice.', documentVerification: 'At the allotted bank.', probation: 'As per bank.',
    },
    syllabus: { officialLink: null, sections: [{ stage: 'Prelims and Mains', subject: 'Tests', topics: ['English', 'Numerical and quantitative aptitude', 'Reasoning and computer aptitude', 'General and financial awareness'] }] },
    syllabusTags: ['english-language', 'quantitative-aptitude', 'reasoning', 'computer-awareness', 'banking-awareness', 'current-affairs'],
    statistics: [{ year: 2026, vacancies: 11403, note: 'As reported for CSA-XVI.', source: 's1' }],
    salary: { payRuleSet: 'bank-12bps', payLevel: 'Clerical scale', payScale: '24,050 to 64,480', startingBasic: 24050, pension: 'NPS.', increments: 'As per scale.', notes: 'Bank DA is revised quarterly; gross not estimated.' },
    career: { progression: [{ post: 'Clerk', level: 'Clerical', timeline: 'Entry', timelineType: 'official' }, { post: 'Officer (JMGS-I) via internal promotion', level: 'JMGS-I', timeline: 'After eligible service and test', timelineType: 'typical' }], promotionNotes: 'Internal promotion exams lead to officer posts.', macp: 'Not applicable.', sources: ['s1'] },
    benefits: [{ item: 'Bank staff benefits', detail: 'Medical, leave fare concession, staff loans, as per bank.', conditional: true, sources: ['s1'] }],
    workLife: { postings: 'Branches in your chosen state.', transfers: 'Mostly within the state.', nature: 'Branch counter and back office.', workload: 'High footfall.', publicInteraction: 'Very high.', hazards: 'Low.', stability: 'High.' },
    difficulty: { syllabusDepth: 'low', competition: 'high', timePressure: 'high', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Simple syllabus but very speed-dependent with lakhs of applicants.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'high', recruitmentRegularity: 'high', rationale: 'Annual; you stay in your state.' },
    risk: { overall: 'low', factors: [{ factor: 'State-wise vacancies', level: 'medium', note: 'Your state may have few vacancies in a given year.' }] },
    sources: [['s1', 'IBPS Clerk 2026 (CRP CSA-XVI) notification report', 'https://www.sreedharscce.com/blogs/ibps-clerk-notification/', 'Sreedhar\'s CCE (reports the IBPS notice)', 2026, 'secondary']],
    dataQuality: { confidence: 'low', gaps: ['Official notice not fetched; dates and vacancies from a secondary report.', 'Exact age reference date and section-wise marks not confirmed for 2026.'], notes: 'Indicative.' },
  },
  {
    id: 'ibps-rrb', name: 'Common Recruitment Process for Regional Rural Banks (Officers and Office Assistants)', abbreviation: 'IBPS RRB', jurisdiction: 'central', sector: 'banking', organization: ibps,
    department: 'Regional Rural Banks (including Andhra Pradesh Grameena Bank, Telangana Grameena Bank and Karnataka Grameena Bank)',
    summary: 'Recruitment for Regional Rural Banks: Office Assistant (Multipurpose), Officer Scale I (Assistant Manager), and Scale II and III specialist and generalist officers. Strong local-language requirement and rural postings.',
    recruitmentMethods: ['competitive-exam', 'interview', 'document-verification'], frequency: 'Annual (IBPS calendar)',
    officialLinks: [{ label: 'IBPS website', url: 'https://www.ibps.in' }],
    status: { type: 'active', note: 'Held every year. CRP RRB-XV (2026): registration reported for September 2026, Prelims in November to December 2026, Mains around December 2026 to January 2027.', cycles: [] },
    posts: [
      { name: 'Office Assistant (Multipurpose)', group: 'Clerical', payLevel: 'RRB clerical scale', startingBasic: null, ageMax: 28, responsibilities: 'Counter and back-office work in rural branches.' },
      { name: 'Officer Scale I (Assistant Manager)', group: 'Officer', payLevel: 'Scale I', startingBasic: 48480, ageMax: 30, responsibilities: 'Branch officer in a rural bank.' },
      { name: 'Officer Scale II (General Banking and Specialist)', group: 'Officer', payLevel: 'Scale II', startingBasic: null, responsibilities: 'Manager; needs experience.', notes: 'Experience required.' },
      { name: 'Officer Scale III (Senior Manager)', group: 'Officer', payLevel: 'Scale III', startingBasic: null, responsibilities: 'Senior branch manager; needs experience.', notes: 'Experience required.' }],
    eligibility: {
      age: { summary: 'Typical limits: Office Assistant 18 to 28; Officer Scale I 18 to 30; Scale II 21 to 32; Scale III 21 to 40 (check the current notice).', referenceDate: 'As per notice' },
      nationality: 'As per notice.',
      domicile: 'Proficiency in the local language of the RRB\'s state is required.',
      education: { summary: 'Graduate in any discipline for Office Assistant and Scale I (preference for agriculture, rural economics and similar for Scale I); specific degrees and experience for Scale II and III.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
    },
    eligibilityRules: { ageMin: 18, ageMax: 40, minEducation: 'graduate', relaxationYears: { OBC: 3, SC: 5, ST: 5, EWS: 0, PwBD: 10 }, notes: 'The 40 upper limit applies only to Scale III; Office Assistant 28, Scale I 30. Local language needed.' },
    selection: {
      stages: [
        { name: 'Preliminary (Office Assistant and Scale I)', type: 'objective', countsInMerit: false, papers: [{ name: 'Reasoning and Numerical / Quantitative Ability', marks: 80, questions: 80, duration: '45 minutes', negative: '0.25' }] },
        { name: 'Main / single exam', type: 'objective', countsInMerit: true, papers: [{ name: 'Reasoning, Quantitative Aptitude, General Awareness, English or Hindi, Computer Knowledge', marks: 200, negative: '0.25' }] },
        { name: 'Interview (officers only)', type: 'interview', countsInMerit: true, papers: [{ name: 'Interview', marks: 100 }] }],
      meritCalculation: 'Office Assistant: Mains marks. Officers: Mains and interview in an 80:20 ratio.', languages: 'English, Hindi and regional languages.', documentVerification: 'At the allotted RRB.', probation: 'As per RRB.',
    },
    syllabus: { officialLink: null, sections: [{ stage: 'Prelims and Mains', subject: 'Tests', topics: ['Reasoning', 'Quantitative aptitude', 'General and financial awareness', 'English or Hindi language', 'Computer knowledge'] }] },
    syllabusTags: ['reasoning', 'quantitative-aptitude', 'banking-awareness', 'current-affairs', 'english-language', 'hindi-language', 'computer-awareness', 'agriculture'],
    statistics: [{ year: 2026, vacancies: 8183, note: 'Office Assistant vacancies reported for RRB-XV.', source: 's1' }],
    salary: { payRuleSet: 'bank-12bps', payLevel: 'RRB scales', payScale: 'Scale I from 48,480', startingBasic: 48480, pension: 'NPS.', increments: 'As per scale.', notes: 'Starting basic shown for Officer Scale I. RRB staff pay follows the public sector bank settlement.' },
    career: { progression: [{ post: 'Officer Scale I', level: 'Scale I', timeline: 'Entry', timelineType: 'official' }, { post: 'Scale II and III', level: 'Scale II to III', timeline: 'By promotion', timelineType: 'typical' }], promotionNotes: 'Promotions within the RRB.', macp: 'Not applicable.', sources: ['s1'] },
    benefits: [{ item: 'Bank staff benefits', detail: 'As per RRB rules.', conditional: true, sources: ['s1'] }],
    workLife: { postings: 'Rural and semi-urban branches within one state.', transfers: 'Within the state.', nature: 'Branch banking, agriculture loans.', workload: 'High; small branches.', publicInteraction: 'Very high.', hazards: 'Low.', stability: 'High.' },
    difficulty: { syllabusDepth: 'low', competition: 'high', timePressure: 'high', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Short, fast Prelims; competition depends on the state.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'high', recruitmentRegularity: 'high', rationale: 'Annual; you work in your home state, mostly in rural areas.' },
    risk: { overall: 'low', factors: [{ factor: 'Rural postings', level: 'medium', note: 'Most branches are rural.' }] },
    sources: [['s1', 'IBPS RRB XV Office Assistant (Multipurpose) 2026 notification report', 'https://www.sreedharscce.com/blogs/ibps-rrb-xv-office-assistant-notification/', 'Sreedhar\'s CCE (reports the IBPS notice)', 2026, 'secondary']],
    dataQuality: { confidence: 'low', gaps: ['Official notice not fetched; vacancies and dates from a secondary report.', 'Age limits shown are typical of recent notices.', 'Office Assistant starting basic not confirmed.'], notes: 'Indicative.' },
  },
]
