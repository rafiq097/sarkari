/**
 * Batch: SSC CPO (SI Delhi Police and CAPF) and GD Constable, from the official 2026
 * notices plus secondary reports (marked as such). SSC MTS is excluded by scope (Level 1 pay).
 */
const ssc = { id: 'ssc', name: 'Staff Selection Commission', abbreviation: 'SSC', website: 'https://ssc.gov.in' }

export default [
  {
    id: 'ssc-cpo', name: 'Sub-Inspector in Delhi Police and Central Armed Police Forces Examination', abbreviation: 'SSC CPO', jurisdiction: 'central', sector: 'capf-police', organization: ssc,
    department: 'Delhi Police; CRPF, BSF, ITBP, CISF, SSB (Ministry of Home Affairs)',
    summary: 'Graduate entry as Sub-Inspector in Delhi Police and the CAPFs, and SI (Fire) in CISF. Two computer-based papers, physical standards and endurance tests, and a medical. Level 6 pay.',
    recruitmentMethods: ['competitive-exam', 'physical-test', 'medical-exam', 'document-verification'], frequency: 'Annual (SSC calendar)',
    officialLinks: [{ label: 'SSC website (CPO 2026 notice)', url: 'https://ssc.gov.in' }],
    status: { type: 'active', note: 'Held every year. 2026 cycle: applications 10 to 30 September 2026; computer-based exam date to be announced.', cycles: [{ cycle: 'CPO 2026', events: [
      { event: 'Applications open', date: '2026-09-10', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-09-30', dateType: 'official', source: 's1' },
      { event: 'Correction window', date: '2026-10-08', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Sub-Inspector (Executive), Delhi Police', group: 'Group C', payLevel: 'Level 6', startingBasic: 35400, responsibilities: 'Police station investigation and law and order in Delhi.', notes: '2026: 317 (205 men, 112 women).' },
      { name: 'Sub-Inspector (GD), CAPFs', group: 'Group B (non-gazetted)', payLevel: 'Level 6', startingBasic: 35400, responsibilities: 'Platoon leader in CRPF, BSF, ITBP, CISF or SSB.', notes: '2026: 1,320 (1,173 men, 147 women).' },
      { name: 'Sub-Inspector (Fire), CISF', group: 'Group B (non-gazetted)', payLevel: 'Level 6', startingBasic: 35400, responsibilities: 'Fire safety at CISF-guarded installations.', notes: '2026: 234 (men only).' }],
    eligibility: {
      age: { summary: '20 to 25 years on 1 August of the exam year (2026: born 2 August 2001 to 1 August 2006).', referenceDate: '1 August of the exam year' },
      nationality: 'Citizen of India.',
      education: { summary: 'A bachelor\'s degree from a recognised university. Delhi Police SI (men) also needs a valid driving licence (LMV) by the PET date, as per previous notices.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      physical: 'Physical Standards Test (height, chest, weight) and Physical Endurance Test (race, long jump, high jump, shot put) as listed in the notice; standards differ for men and women and for some regional groups.',
      examVsPost: 'Delhi Police SI and CAPF SI are filled from one exam but have separate vacancies and some different conditions.',
    },
    eligibilityRules: { ageMin: 20, ageMax: 25, minEducation: 'graduate', finalYearAllowed: true, notes: 'Physical tests apply. Delhi Police SI men need a light motor vehicle licence by the physical tests.' },
    selection: {
      stages: [
        { name: 'Paper I (computer-based)', type: 'objective', countsInMerit: true, papers: [
          { name: 'General Intelligence and Reasoning', questions: 25, marks: 25 }, { name: 'General Knowledge and General Awareness', questions: 25, marks: 25 },
          { name: 'Quantitative Aptitude', questions: 25, marks: 25 }, { name: 'English Comprehension', questions: 25, marks: 25 }], notes: 'Revised 2026 pattern as reported: 100 marks, 1 hour, 15-minute timer per section.' },
        { name: 'Physical Standards and Endurance Tests', type: 'physical', countsInMerit: false, notes: 'Qualifying.' },
        { name: 'Paper II (computer-based)', type: 'objective', countsInMerit: true, notes: 'Revised 2026 pattern as reported: four sections for 320 marks, with English Comprehension weighted most (200 marks). Confirm the exact pattern in the official notice.' },
        { name: 'Medical examination', type: 'medical', countsInMerit: false }],
      meritCalculation: 'Merit from Paper I and Paper II for candidates who qualify the physical tests and medical.', languages: 'English and Hindi (English sections in English).', documentVerification: 'Before the medical.', probation: 'Training at the force or Delhi Police academy.',
    },
    syllabus: { officialLink: null, sections: [{ stage: 'Paper I and II', subject: 'Sections', topics: ['General intelligence and reasoning', 'General knowledge and awareness', 'Quantitative aptitude', 'English comprehension'] }] },
    syllabusTags: ['reasoning', 'general-awareness', 'quantitative-aptitude', 'english-language', 'physical-fitness'],
    statistics: [{ year: 2026, vacancies: 1871, note: 'Tentative vacancies as reported. The official notice lists 205 male and 112 female Delhi Police posts plus force-wise CAPF posts.', source: 's2' }],
    salary: { payRuleSet: 'central-7cpc', payLevel: 'Level 6', payScale: '35,400 to 1,12,400', startingBasic: 35400, pension: 'NPS with the UPS option.', increments: '3% a year; MACP.', specialAllowances: [{ name: 'Force allowances', detail: 'Risk, hardship and ration allowances as per force rules.' }] },
    career: { progression: [
      { post: 'Sub-Inspector', level: 'Level 6', timeline: 'Entry', timelineType: 'official' },
      { post: 'Inspector', level: 'Level 7', timeline: 'By promotion', timelineType: 'typical' },
      { post: 'Assistant Commandant / ACP (via departmental routes)', level: 'Level 10', timeline: 'Senior', timelineType: 'typical' }],
      promotionNotes: 'Promotion depends on the force and vacancies; CAPF SIs can also take the LDCE for Assistant Commandant.', macp: 'MACP at 10, 20 and 30 years.' },
    workLife: { postings: 'Delhi (Delhi Police) or anywhere in India including borders (CAPFs).', transfers: 'Frequent in CAPFs.', nature: 'Field policing.', workload: 'High; shift and emergency duty.', publicInteraction: 'High in Delhi Police.', hazards: 'High in CAPF deployments.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'high', technicalComplexity: 'low', physicalRequirements: 'high', selectionUncertainty: 'medium', rationale: 'Graduate-level written papers plus demanding physical tests for about 2,000 posts.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'low', recruitmentRegularity: 'high', rationale: 'Annual. Postings anywhere for CAPFs.' },
    risk: { overall: 'medium', factors: [{ factor: 'Pattern change in 2026', level: 'medium', note: 'The paper structure was revised in 2026.' }, { factor: 'Physical and medical rejection', level: 'medium', note: 'PET and medical eliminate many.' }] },
    sources: [['s1', 'SSC CPO 2026 notification out: 1,871 Delhi Police and CAPF SI posts, revised pattern', 'https://news.careers360.com/ssc-cpo-notification-2026-out-ssc-gov-in-application-vacancy-syllabus-exam-pattern-delhi-police-capf-si-recruitment/amp', 'Careers360 (reports the SSC notice)', 2026, 'secondary'], ['s2', 'SSC notice: Sub-Inspector in Delhi Police and CAPFs Examination, 2026', 'https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_capf_2026.pdf', 'Staff Selection Commission', 2026]],
    sharedSources: ['sscCalendar'],
    dataQuality: { confidence: 'medium', gaps: ['CAPF force-wise total not added up from the notice.', 'Physical standards not reproduced in full.'], notes: 'Treat this profile as indicative until checked against the SSC notice.' },
  },
  {
    id: 'ssc-gd-constable', name: 'Constable (GD) in CAPFs, SSF, NIA and Rifleman (GD) in Assam Rifles', abbreviation: 'SSC GD', jurisdiction: 'central', sector: 'capf-police', organization: ssc,
    department: 'BSF, CISF, CRPF, ITBP, SSB, Secretariat Security Force, NIA, Assam Rifles',
    summary: 'The largest SSC recruitment: tens of thousands of Constable (General Duty) posts in the central armed police forces and Assam Rifles, for Class 10 pass candidates. Computer-based exam, then physical tests, medical and documents.',
    recruitmentMethods: ['competitive-exam', 'physical-test', 'medical-exam', 'document-verification'], frequency: 'Annual (SSC calendar)',
    officialLinks: [{ label: 'SSC website', url: 'https://ssc.gov.in' }],
    status: { type: 'active', note: 'Held every year. The 2026 cycle had 25,487 vacancies; its exam, first scheduled for 23 February 2026, was postponed. The SSC calendar lists the 2027 cycle notice for September 2026 with exams in January to March 2027.', cycles: [{ cycle: 'GD 2026', events: [
      { event: 'Original exam date (postponed)', date: '2026-02-23', dateType: 'official', source: 's1' },
      { event: 'Computer-based exam ends', date: '2026-05-30', dateType: 'official', source: 's3' },
      { event: 'PET / PST shortlist published', date: '2026-10-12', dateType: 'official', source: 's3' }] }] },
    posts: [
      { name: 'Constable (GD) in BSF, CISF, CRPF, ITBP, SSB, SSF', group: 'Group C', payLevel: 'Level 3', startingBasic: 21700, responsibilities: 'Armed guard, border and internal security duties.' },
      { name: 'Rifleman (GD), Assam Rifles', group: 'Group C', payLevel: 'Level 3', startingBasic: 21700, responsibilities: 'Counter-insurgency and border duty in the North East.' }],
    eligibility: {
      age: { summary: '18 to 23 years on 1 January of the exam year (2026 cycle).', referenceDate: '1 January of the exam year' },
      nationality: 'Citizen of India; domicile certificate decides the state/area vacancies you compete for.',
      education: { summary: 'Class 10 (Matriculation) pass.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      physical: 'Physical Standards Test (height, chest, weight) and a Physical Efficiency Test (timed run) as listed in the notice, with relaxed standards for some regions and communities. NCC certificate holders get bonus marks.',
      examVsPost: 'Vacancies are allotted by state and area of domicile, and separately for men and women.',
    },
    eligibilityRules: { ageMin: 18, ageMax: 23, minEducation: 'class-10', notes: 'Usual band 18 to 23. PET/PST apply. State domicile decides vacancies.' },
    selection: {
      stages: [
        { name: 'Computer-based exam', type: 'objective', countsInMerit: true, papers: [
          { name: 'General Intelligence and Reasoning', questions: 20, marks: 40 }, { name: 'General Knowledge and General Awareness', questions: 20, marks: 40 },
          { name: 'Elementary Mathematics', questions: 20, marks: 40 }, { name: 'English / Hindi', questions: 20, marks: 40 }], notes: '80 questions, 160 marks.' },
        { name: 'PET and PST', type: 'physical', countsInMerit: false, notes: 'Qualifying.' },
        { name: 'Medical and document verification', type: 'medical', countsInMerit: false }],
      meritCalculation: 'Merit from the computer-based exam plus NCC bonus marks, among candidates passing PET/PST and medical.', languages: 'English, Hindi and regional languages.', documentVerification: 'With the medical.', probation: 'Basic training at force training centres.',
    },
    syllabus: { officialLink: null, sections: [{ stage: 'CBE', subject: 'Four parts', topics: ['Reasoning', 'General knowledge and awareness', 'Elementary mathematics', 'English or Hindi'] }] },
    syllabusTags: ['reasoning', 'general-awareness', 'quantitative-aptitude', 'english-language', 'hindi-language', 'physical-fitness'],
    statistics: [{ year: 2026, vacancies: 25487, note: 'Tentative, from the 2026 notice.', source: 's2' }],
    salary: { payRuleSet: 'central-7cpc', payLevel: 'Level 3', payScale: '21,700 to 69,100', startingBasic: 21700, pension: 'NPS with the UPS option.', increments: '3% a year; MACP.', specialAllowances: [{ name: 'Risk and hardship, ration money', detail: 'As per force and area.' }] },
    career: { progression: [
      { post: 'Constable', level: 'Level 3', timeline: 'Entry', timelineType: 'official' },
      { post: 'Head Constable', level: 'Level 4', timeline: 'By promotion', timelineType: 'typical' },
      { post: 'ASI / SI (by promotion or LDCE)', level: 'Level 5 to 6', timeline: 'Mid career', timelineType: 'typical' }],
      promotionNotes: 'Promotions are slow and vacancy-driven; departmental exams speed them up.', macp: 'MACP at 10, 20 and 30 years.' },
    workLife: { postings: 'Borders, insurgency areas, industrial sites; anywhere in India.', transfers: 'Frequent.', nature: 'Field duty.', workload: 'Very high.', publicInteraction: 'Low to moderate.', hazards: 'High.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'low', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'high', selectionUncertainty: 'medium', rationale: 'Easy syllabus but millions of applicants; the physical tests eliminate many.' },
    ratings: { careerGrowth: 'low', locationFlexibility: 'low', recruitmentRegularity: 'high', rationale: 'Annual mass recruitment; hard field postings.' },
    risk: { overall: 'medium', factors: [{ factor: 'Postponements', level: 'medium', note: 'The 2026 exam was postponed.' }, { factor: 'Physical rejection', level: 'high', note: 'PET/PST eliminate many candidates.' }] },
    sources: [['s1', 'SSC GD Constable 2026 exam postponed; 25,487 vacancies', 'https://news.careers360.com/ssc-gd-constable-2026-exam-postponed-25487-vacancies-new-date-soon-capfs-ssf-assam-rifles-pattern-hall-ticket-city-slip-updates', 'Careers360 (reports the SSC notice)', 2026, 'secondary'], ['s2', 'SSC notice: Constable (GD) in CAPFs, SSF and Rifleman (GD) in Assam Rifles Examination, 2026', 'https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_CTGD_2026.pdf', 'Staff Selection Commission', 2025], ['s3', 'SSC write-up: shortlisting for PET / PST, Constable (GD) 2026 (12 Oct 2026)', 'https://ssc.gov.in/api/attachment/uploads/masterData/Results/writeup_12102026.pdf', 'Staff Selection Commission', 2026]],
    sharedSources: ['sscCalendar'],
    dataQuality: { confidence: 'high', gaps: ['Physical standards not reproduced in full.'], notes: 'Vacancies, age, pay and pattern from the official 2026 notice; later stages from the SSC write-up.' },
  },
]
