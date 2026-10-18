/**
 * Batch: SSC MTS & Havaldar, CPO (SI Delhi Police and CAPF), GD Constable.
 * MTS facts from the official 2025 notice; CPO 2026 and GD 2026 cycle facts from
 * secondary reports where the official notice could not be fetched (marked as such).
 */
const ssc = { id: 'ssc', name: 'Staff Selection Commission', abbreviation: 'SSC', website: 'https://ssc.gov.in' }
const noticeBase = 'https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards'

export default [
  {
    id: 'ssc-mts-havaldar', name: 'Multi-Tasking (Non-Technical) Staff and Havaldar (CBIC and CBN) Examination', abbreviation: 'SSC MTS', jurisdiction: 'central', sector: 'ssc', organization: ssc,
    department: 'Central ministries and offices; Havaldar in CBIC and CBN (Department of Revenue)',
    summary: 'Class 10 level recruitment for Multi-Tasking Staff (office support) and Havaldar posts in customs and narcotics. One computer-based exam in two sessions, plus a walking test and physical standards for Havaldar. Level 1 pay.',
    recruitmentMethods: ['competitive-exam', 'physical-test', 'document-verification'], frequency: 'Annual (SSC calendar)',
    officialLinks: [{ label: 'MTS & Havaldar 2025 notice', url: `${noticeBase}/Notice_of_adv_mts_2025.pdf` }],
    status: { type: 'recurring', note: 'Held every year. The 2025 cycle was notified on 26 June 2025 (7,948 vacancies). The SSC calendar listed the 2026 notice for June 2026; check the SSC website for its release.', cycles: [{ cycle: 'MTS & Havaldar 2025', events: [
      { event: 'Notice and applications open', date: '2025-06-26', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Multi-Tasking Staff (Non-Technical)', group: 'Group C', payLevel: 'Level 1', startingBasic: 18000, ageMax: 25, responsibilities: 'Office support: files, records, maintenance, dak, basic clerical help.' },
      { name: 'Havaldar (CBIC and CBN)', group: 'Group C', payLevel: 'Level 1', startingBasic: 18000, ageMax: 27, responsibilities: 'Field support in customs, GST and narcotics offices.', notes: 'Walking test and physical standards apply.' }],
    eligibility: {
      age: { summary: 'MTS: 18 to 25. Havaldar and a few MTS posts: 18 to 27. On 1 August of the exam year (2025 cycle: MTS born 2 Aug 2000 to 1 Aug 2007).', referenceDate: '1 August of the exam year' },
      nationality: 'As per notice.',
      education: { summary: 'Class 10 (Matriculation) pass or equivalent.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      physical: 'Havaldar only. Walking: men 1,600 m in 15 minutes; women 1 km in 20 minutes. Height: men 157.5 cm, women 152 cm (relaxable for Garhwalis, Assamese, Gorkhas and ST). Men chest 81 cm with 5 cm expansion. Women weight 48 kg (relaxable by 2 kg for the same groups).',
      examVsPost: 'You can apply for MTS, Havaldar or both. Havaldar needs the physical tests.',
    },
    eligibilityRules: { ageMin: 18, ageMax: 27, ageReferenceDate: null, minEducation: 'class-10', notes: 'MTS closes at 25; Havaldar at 27. Physical tests for Havaldar.' },
    selection: {
      stages: [
        { name: 'Computer-based exam, Session I', type: 'objective', countsInMerit: true, papers: [
          { name: 'Numerical and Mathematical Ability', marks: 60, questions: 20 },
          { name: 'Reasoning Ability and Problem Solving', marks: 60, questions: 20 }], notes: '45 minutes. No negative marking.' },
        { name: 'Computer-based exam, Session II', type: 'objective', countsInMerit: true, papers: [
          { name: 'General Awareness', marks: 75, questions: 25 },
          { name: 'English Language and Comprehension', marks: 75, questions: 25 }], notes: '45 minutes. Minus 1 mark per wrong answer.' },
        { name: 'PET and PST (Havaldar only)', type: 'physical', countsInMerit: false }],
      meritCalculation: 'Merit from the computer-based exam (both sessions must be qualified); Havaldar also needs PET/PST.',
      languages: 'English, Hindi and 13 regional languages (including Telugu and Kannada) for Session I and the General Awareness section.', documentVerification: 'After the exam.', probation: 'As per user department.',
    },
    syllabus: { officialLink: `${noticeBase}/Notice_of_adv_mts_2025.pdf`, sections: [{ stage: 'CBE', subject: 'Four parts', topics: ['Numerical and mathematical ability (Class 10)', 'Reasoning and problem solving', 'General awareness', 'English language and comprehension'] }] },
    syllabusTags: ['quantitative-aptitude', 'reasoning', 'general-awareness', 'english-language', 'physical-fitness'],
    statistics: [{ year: 2025, vacancies: 7948, note: 'MTS and Havaldar vacancies for the 2025 cycle as reported; result published in 2026.', source: 's2' }],
    salary: { payRuleSet: 'central-7cpc', payLevel: 'Level 1', payScale: '18,000 to 56,900', startingBasic: 18000, pension: 'NPS with the UPS option.', increments: '3% a year; MACP.' },
    career: { progression: [
      { post: 'MTS', level: 'Level 1', timeline: 'Entry', timelineType: 'official' },
      { post: 'LDC (through departmental quota or exam)', level: 'Level 2', timeline: 'Depends on department', timelineType: 'typical' }],
      promotionNotes: 'Limited promotion; many MTS staff move up by passing departmental LDC exams or later SSC exams.', macp: 'MACP at 10, 20 and 30 years.' },
    workLife: { postings: 'Central offices across India, often in your region.', transfers: 'Rare.', nature: 'Office support.', workload: 'Light to moderate.', publicInteraction: 'Low.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'low', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Class 10 syllabus, but tens of lakhs apply. Havaldar adds an easy walking test.' },
    ratings: { careerGrowth: 'low', locationFlexibility: 'high', recruitmentRegularity: 'high', rationale: 'Annual; regional state-wise vacancies; slow growth.' },
    risk: { overall: 'low', factors: [{ factor: 'Delayed notices', level: 'medium', note: 'The 2026 notice slipped beyond its calendar date.' }, { factor: 'Low growth', level: 'medium', note: 'Pay starts at Level 1.' }] },
    sources: [['s1', 'Notice: MTS (Non-Technical) Staff and Havaldar (CBIC & CBN) Examination, 2025', `${noticeBase}/Notice_of_adv_mts_2025.pdf`, 'Staff Selection Commission', 2025], ['s2', 'SSC MTS 2025 vacancies and result update', 'https://www.sarkarijobs.com/news/ssc-mts-result-2026-declared-cbic-havaldar-pet-pst-scheduled-from-august-24/', 'SarkariJobs (news)', 2026, 'secondary']],
    sharedSources: ['sscCalendar'],
    dataQuality: { confidence: 'medium', gaps: ['2026 notice not yet seen; facts are from the 2025 notice.', '7,948 vacancy figure is from a secondary report.'], notes: 'Scheme, ages and Havaldar standards from the official 2025 notice.' },
  },
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
      age: { summary: 'Usually 20 to 25 years on 1 August of the exam year (check the current notice).', referenceDate: '1 August of the exam year (usual)' },
      nationality: 'Citizen of India.',
      education: { summary: 'A bachelor\'s degree from a recognised university. Delhi Police SI (men) also needs a valid driving licence (LMV) by the PET date, as per previous notices.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      physical: 'Physical Standards Test (height, chest, weight) and Physical Endurance Test (race, long jump, high jump, shot put) as listed in the notice; standards differ for men and women and for some regional groups.',
      examVsPost: 'Delhi Police SI and CAPF SI are filled from one exam but have separate vacancies and some different conditions.',
    },
    eligibilityRules: { ageMin: 20, ageMax: 24, minEducation: 'graduate', notes: 'Under 25 on the reference date is the usual rule. Physical tests apply. Delhi Police SI men need a driving licence.' },
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
    statistics: [{ year: 2026, vacancies: 1871, note: 'Tentative vacancies as reported (another report gives 2,018).', source: 's1' }],
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
    sources: [['s1', 'SSC CPO 2026 notification out: 1,871 Delhi Police and CAPF SI posts, revised pattern', 'https://news.careers360.com/ssc-cpo-notification-2026-out-ssc-gov-in-application-vacancy-syllabus-exam-pattern-delhi-police-capf-si-recruitment/amp', 'Careers360 (reports the SSC notice)', 2026, 'secondary']],
    sharedSources: ['sscCalendar'],
    dataQuality: { confidence: 'low', gaps: ['Official 2026 notice could not be fetched; dates, vacancies and pattern are from a secondary report.', 'Exact Paper II pattern, age limits and physical standards for 2026 not verified.'], notes: 'Treat this profile as indicative until checked against the SSC notice.' },
  },
  {
    id: 'ssc-gd-constable', name: 'Constable (GD) in CAPFs, SSF, NIA and Rifleman (GD) in Assam Rifles', abbreviation: 'SSC GD', jurisdiction: 'central', sector: 'capf-police', organization: ssc,
    department: 'BSF, CISF, CRPF, ITBP, SSB, Secretariat Security Force, NIA, Assam Rifles',
    summary: 'The largest SSC recruitment: tens of thousands of Constable (General Duty) posts in the central armed police forces and Assam Rifles, for Class 10 pass candidates. Computer-based exam, then physical tests, medical and documents.',
    recruitmentMethods: ['competitive-exam', 'physical-test', 'medical-exam', 'document-verification'], frequency: 'Annual (SSC calendar)',
    officialLinks: [{ label: 'SSC website', url: 'https://ssc.gov.in' }],
    status: { type: 'active', note: 'Held every year. The 2026 cycle had 25,487 vacancies; its exam, first scheduled for 23 February 2026, was postponed. The SSC calendar lists the 2027 cycle notice for September 2026 with exams in January to March 2027.', cycles: [{ cycle: 'GD 2026', events: [
      { event: 'Original exam date (postponed)', date: '2026-02-23', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Constable (GD) in BSF, CISF, CRPF, ITBP, SSB, SSF', group: 'Group C', payLevel: 'Level 3', startingBasic: 21700, responsibilities: 'Armed guard, border and internal security duties.' },
      { name: 'Rifleman (GD), Assam Rifles', group: 'Group C', payLevel: 'Level 3', startingBasic: 21700, responsibilities: 'Counter-insurgency and border duty in the North East.' }],
    eligibility: {
      age: { summary: 'Usually 18 to 23 years on 1 January of the exam year (check the current notice).', referenceDate: '1 January of the exam year (usual)' },
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
    statistics: [{ year: 2026, vacancies: 25487, note: 'As reported for the 2026 cycle.', source: 's1' }],
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
    sources: [['s1', 'SSC GD Constable 2026 exam postponed; 25,487 vacancies', 'https://news.careers360.com/ssc-gd-constable-2026-exam-postponed-25487-vacancies-new-date-soon-capfs-ssf-assam-rifles-pattern-hall-ticket-city-slip-updates', 'Careers360 (reports the SSC notice)', 2026, 'secondary']],
    sharedSources: ['sscCalendar'],
    dataQuality: { confidence: 'low', gaps: ['Official GD notice could not be fetched; age, physical standards and NCC bonus details are not quoted from it.', 'Rescheduled 2026 exam date not recorded.'], notes: 'Indicative profile; verify on ssc.gov.in.' },
  },
]
