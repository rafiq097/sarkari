/**
 * Batch: IBPS Clerk (CRP CSA-XVI) and IBPS RRB (CRP RRBs-XV), from the official 2026
 * notifications and the IBPS 2026-27 calendar; vacancy totals as reported.
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
      { event: 'Applications open', date: '2026-08-01', dateType: 'official', source: 's2' },
      { event: 'Last date to apply', date: '2026-08-21', dateType: 'official', source: 's2' },
      { event: 'Preliminary exam', date: '2026-10-10', dateType: 'official-tentative', source: 's3' },
      { event: 'Main exam', date: '2026-12-27', dateType: 'official-tentative', source: 's3' }] }] },
    posts: [{ name: 'Customer Service Associate (Clerk)', group: 'Clerical cadre', payLevel: 'Bank clerical scale', startingBasic: 24050, responsibilities: 'Cash, deposits, customer service and back office in a branch.', notes: 'Scale 24,050 to 64,480 (12th Bipartite Settlement).' }],
    eligibility: {
      age: { summary: '20 to 28 years on 1 August of the cycle year (2026 cycle).', referenceDate: '1 August of the cycle year' },
      nationality: 'Citizen of India or other categories as per notice.',
      domicile: 'Apply for one state or UT; proficiency in its official language is required (Telugu for AP and Telangana, Kannada for Karnataka).',
      education: { summary: 'A degree in any discipline; computer literacy (certificate, or computers as a subject) as per the notice.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
    },
    eligibilityRules: { ageMin: 20, ageMax: 28, minEducation: 'graduate', relaxationYears: { OBC: 3, SC: 5, ST: 5, EWS: 0, PwBD: 10 }, notes: 'State language proficiency needed.' },
    selection: {
      stages: [
        { name: 'Preliminary (online)', type: 'objective', countsInMerit: false, papers: [{ name: 'English 30, Numerical Ability 35, Reasoning 35 (20 minutes each)', marks: 100, questions: 100, duration: '60 minutes', negative: '0.25' }], notes: 'You must clear the cut-off in each test.' },
        { name: 'Main (online)', type: 'objective', countsInMerit: true, papers: [{ name: 'General / Financial Awareness 40 questions (50 marks), General English 40 (40), Reasoning 40 (60), Quantitative Aptitude 40 (50)', marks: 200, questions: 160, duration: '125 minutes', negative: '0.25' }] },
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
    sources: [['s1', 'IBPS Clerk 2026 (CRP CSA-XVI) notification report', 'https://www.sreedharscce.com/blogs/ibps-clerk-notification/', 'Sreedhar\'s CCE (reports the IBPS notice)', 2026, 'secondary'], ['s2', 'IBPS CRP CSA-XVI notification (vacancies of 2027-28)', 'https://www.ibps.in/wp-content/uploads/Notification_CRP_CSA_XVI-Final.pdf', 'Institute of Banking Personnel Selection', 2026], ['s3', 'IBPS tentative calendar of online CRPs 2026-27', 'https://www.ibps.in/wp-content/uploads/IBPS_CALENDAR_2026-27_final.pdf', 'Institute of Banking Personnel Selection', 2026]],
    dataQuality: { confidence: 'high', gaps: ['Vacancy total as reported; indicative state-wise numbers change with corrigenda.'], notes: 'Age, pattern, pay and dates from the official notification and calendar.' },
  },
  {
    id: 'ibps-rrb', name: 'Common Recruitment Process for Regional Rural Banks (Officers and Office Assistants)', abbreviation: 'IBPS RRB', jurisdiction: 'central', sector: 'banking', organization: ibps,
    department: 'Regional Rural Banks (including Andhra Pradesh Grameena Bank, Telangana Grameena Bank and Karnataka Grameena Bank)',
    summary: 'Recruitment for Regional Rural Banks: Office Assistant (Multipurpose), Officer Scale I (Assistant Manager), and Scale II and III specialist and generalist officers. Strong local-language requirement and rural postings.',
    recruitmentMethods: ['competitive-exam', 'interview', 'document-verification'], frequency: 'Annual (IBPS calendar)',
    officialLinks: [{ label: 'IBPS website', url: 'https://www.ibps.in' }],
    status: { type: 'active', note: 'Held every year. CRP RRBs-XV (2026): registration 1 to 27 September 2026. Officer Scale I prelims 21 and 22 November, Officer mains 20 December 2026; Office Assistant prelims 6, 12 and 13 December 2026, mains 30 January 2027.', cycles: [{ cycle: 'CRP RRBs-XV', events: [
      { event: 'Registration opens', date: '2026-09-01', dateType: 'official', source: 's2' },
      { event: 'Officer Scale I prelims', date: '2026-11-21', dateType: 'official-tentative', source: 's3' },
      { event: 'Office Assistant prelims', date: '2026-12-06', dateType: 'official-tentative', source: 's3' },
      { event: 'Office Assistant mains', date: '2027-01-30', dateType: 'official-tentative', source: 's3' }] }] },
    posts: [
      { name: 'Office Assistant (Multipurpose)', group: 'Clerical', payLevel: 'RRB clerical scale', startingBasic: null, ageMax: 28, responsibilities: 'Counter and back-office work in rural branches.' },
      { name: 'Officer Scale I (Assistant Manager)', group: 'Officer', payLevel: 'Scale I', startingBasic: 48480, ageMax: 30, responsibilities: 'Branch officer in a rural bank.' },
      { name: 'Officer Scale II (General Banking and Specialist)', group: 'Officer', payLevel: 'Scale II', startingBasic: null, responsibilities: 'Manager; needs experience.', notes: 'Experience required.' },
      { name: 'Officer Scale III (Senior Manager)', group: 'Officer', payLevel: 'Scale III', startingBasic: null, responsibilities: 'Senior branch manager; needs experience.', notes: 'Experience required.' }],
    eligibility: {
      age: { summary: 'On 1 September of the cycle year: Office Assistant 18 to 28; Officer Scale I 18 to 30; Scale II 21 to 32; Scale III as per the notice.', referenceDate: '1 September of the cycle year' },
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
    sources: [['s1', 'IBPS RRB XV Office Assistant (Multipurpose) 2026 notification report', 'https://www.sreedharscce.com/blogs/ibps-rrb-xv-office-assistant-notification/', 'Sreedhar\'s CCE (reports the IBPS notice)', 2026, 'secondary'], ['s2', 'IBPS CRP RRBs-XV notification (Officers and Office Assistants)', 'https://www.ibps.in/wp-content/uploads/CRP-RRBs-XV-notification.pdf', 'Institute of Banking Personnel Selection', 2026], ['s3', 'IBPS tentative calendar of online CRPs 2026-27', 'https://www.ibps.in/wp-content/uploads/IBPS_CALENDAR_2026-27_final.pdf', 'Institute of Banking Personnel Selection', 2026]],
    dataQuality: { confidence: 'medium', gaps: ['Vacancy total as reported.', 'Office Assistant starting basic not confirmed.'], notes: 'Ages and dates from the official notification and calendar.' },
  },
]
