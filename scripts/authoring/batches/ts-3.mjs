/**
 * Batch: Telangana Police SI and Constable (TSLPRB, last cycle 2022) and TG DSC / TRT
 * (last cycle 2024). Recurring routes; figures from news reports (secondary), with
 * conflicting or unverified values left empty.
 */
const tslprb = { id: 'tslprb', name: 'Telangana State Level Police Recruitment Board', abbreviation: 'TSLPRB', website: 'https://www.tslprb.in' }
const tsSchool = { id: 'ts-school-education', name: 'Department of School Education, Telangana', abbreviation: 'TG School Education', website: 'https://schooledu.telangana.gov.in' }
const tsRelax = [{ category: 'SC, ST, BC and EWS', years: 5 }, { category: 'Others', years: null, note: 'As per notification.' }]

export default [
  {
    id: 'ts-police', name: 'Telangana Police Sub-Inspector and Constable Recruitment', abbreviation: 'TS Police', jurisdiction: 'telangana', sector: 'capf-police', organization: tslprb,
    department: 'Telangana Police, Excise, Fire, Prisons and SPF', summary: 'Telangana\'s mass police recruitment for Stipendiary Cadet Trainee Sub-Inspectors and Police Constables (civil, AR, TSSP) and related posts in excise, fire and prisons. Preliminary test, physical tests, final written exam.',
    recruitmentMethods: ['competitive-exam', 'physical-test', 'medical-exam', 'document-verification'], frequency: 'Irregular (2016, 2018, 2022)',
    officialLinks: [{ label: 'TSLPRB website', url: 'https://www.tslprb.in' }],
    status: { type: 'recurring', note: 'The last large cycle was notified in April 2022 (applications 2 to 20 May 2022); final written results came in 2023 and selections followed. No new notification was found by October 2026.', cycles: [{ cycle: '2022 recruitment', events: [{ event: 'Applications open', date: '2022-05-02', dateType: 'official', source: 's1' }, { event: 'Last date to apply', date: '2022-05-20', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'SCT Sub-Inspector (Civil, AR, TSSP and others)', group: 'Non-gazetted', payLevel: 'TS RPS 2020', startingBasic: null, responsibilities: 'Station house and investigation duties.', notes: '2022: reported 554 to 587 posts.' },
      { name: 'SCT Police Constable (Civil, AR, TSSP and others)', group: 'Non-gazetted', payLevel: 'TS RPS 2020', startingBasic: null, responsibilities: 'Police station and armed reserve duties.', notes: '2022: reported about 16,000 to 17,000 posts.' }],
    eligibility: {
      age: { summary: 'Age limits are set in each notification; the 2022 notification gave extra age relaxation. Check the next notification.', referenceDate: 'As per notification', relaxations: tsRelax },
      nationality: 'Citizen of India.', domicile: 'Local cadre (district / zone) rules with 95% local reservation.',
      education: { summary: 'Constable: Intermediate (Class 12). SI: a bachelor\'s degree. Technical posts need specific qualifications.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      physical: 'Physical measurement and efficiency tests (running, long jump, shot put) as per notification.',
    },
    eligibilityRules: { ageMin: 18, ageMax: null, minEducation: 'class-12', relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 0 }, domicile: 'telangana', notes: 'Upper age limit depends on the notification. SI posts need a degree.' },
    selection: { stages: [
      { name: 'Preliminary written test', type: 'objective', countsInMerit: false },
      { name: 'Physical measurement and efficiency tests', type: 'physical', countsInMerit: false },
      { name: 'Final written exam', type: 'objective', countsInMerit: true },
      { name: 'Certificate verification and medical', type: 'document', countsInMerit: false }],
      meritCalculation: 'Merit from the final written exam among candidates clearing the qualifying stages.', languages: 'English, Telugu, Urdu.', probation: 'Training with stipend.' },
    syllabus: { officialLink: null, sections: [{ stage: 'Written tests', subject: 'Typical areas', topics: ['Arithmetic and reasoning', 'General studies including Telangana history and movement', 'English (SI)'] }] },
    syllabusTags: ['quantitative-aptitude', 'reasoning', 'general-awareness', 'telangana-history-culture', 'telangana-movement', 'english-language', 'physical-fitness'],
    statistics: [],
    salary: { payRuleSet: 'ts-rps-2020', payLevel: 'TS RPS 2020', payScale: null, startingBasic: null, pension: 'Contributory Pension Scheme.', notes: 'Pay scales are in each notification; not confirmed here.' },
    career: { progression: [{ post: 'Constable', level: 'RPS 2020', timeline: 'Entry', timelineType: 'official' }, { post: 'Head Constable, ASI, SI', level: 'Higher scales', timeline: 'By promotion', timelineType: 'typical' }], sources: ['s1'] },
    workLife: { postings: 'Within the district or unit.', transfers: 'Periodic.', nature: 'Field policing.', workload: 'Very high.', publicInteraction: 'Very high.', hazards: 'Moderate.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'low', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'high', selectionUncertainty: 'medium', rationale: 'Lakhs of candidates; physical tests eliminate many.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'high', recruitmentRegularity: 'low', rationale: 'Large intakes but years apart.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'Last cycle 2022.' }] },
    sources: [['s1', 'TSLPRB notification 2022: age limit and application dates', 'https://news.aglasem.com/tslprb-notification-2022-age-limit-application-date/', 'AglaSem (reports the TSLPRB notification)', 2022, 'secondary'], ['s2', 'TS Police mains result 2023 for Constable and SI', 'https://scroll.in/announcements/1050100/ts-police-mains-result-2023-declared-for-constable-and-si-posts-check-direct-links', 'Scroll', 2023, 'secondary']],
    dataQuality: { confidence: 'low', gaps: ['Vacancy counts for 2022 differ between reports.', 'Age limits, pay scales and PET standards not verified from the official notification.', 'Next cycle not notified.'], notes: 'Indicative profile for a recurring route.' },
  },
  {
    id: 'tg-dsc', name: 'Telangana Teacher Recruitment Test (DSC)', abbreviation: 'TG DSC', jurisdiction: 'telangana', sector: 'teaching', organization: tsSchool,
    department: 'School Education, Telangana', summary: 'Recruitment of government school teachers in Telangana (School Assistants, Secondary Grade Teachers, Language Pandits, PETs and special education teachers) through a computer-based Teacher Recruitment Test, with TET score weightage.',
    recruitmentMethods: ['competitive-exam', 'document-verification'], frequency: 'Irregular (2017, 2024)',
    officialLinks: [{ label: 'School Education Telangana', url: 'https://schooledu.telangana.gov.in' }],
    status: { type: 'recurring', note: 'The last DSC (2024) recruited about 11,062 teachers. A 2026 DSC had not been officially notified by mid-October 2026.', cycles: [] },
    posts: [
      { name: 'School Assistant', group: 'Teacher', payLevel: 'TS RPS 2020', startingBasic: null, responsibilities: 'High school subject teacher.' },
      { name: 'Secondary Grade Teacher', group: 'Teacher', payLevel: 'TS RPS 2020', startingBasic: null, responsibilities: 'Primary classes.' },
      { name: 'Language Pandit and Physical Education Teacher', group: 'Teacher', payLevel: 'TS RPS 2020', startingBasic: null, responsibilities: 'Languages and physical education.' }],
    eligibility: {
      age: { summary: 'Set in each notification.', referenceDate: 'As per notification', relaxations: tsRelax },
      nationality: 'Citizen of India.', domicile: 'District cadre with local reservation.',
      education: { summary: 'SGT: Intermediate with D.El.Ed. School Assistant: degree in the subject with B.Ed. TG TET (or CTET where allowed) is required for SGT and SA posts, as per NCTE norms.', finalYearAllowed: false, minMarks: 'As per NCTE norms' },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      examVsPost: 'TET is a separate qualifying test; its score carries 20% weightage in the TRT merit.',
    },
    eligibilityRules: { ageMin: 18, ageMax: null, minEducation: 'class-12', educationFields: ['education'], relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }, domicile: 'telangana', notes: 'Needs D.El.Ed or B.Ed and TG TET.' },
    selection: { stages: [{ name: 'Teacher Recruitment Test (computer-based)', type: 'objective', countsInMerit: true }, { name: 'Certificate verification', type: 'document', countsInMerit: false }],
      meritCalculation: 'TRT marks with 20% weightage for the TET score, as stated in the TG TET notification.', languages: 'Telugu, English, Urdu and others as per post.', probation: 'As per rules.' },
    syllabus: { officialLink: null, sections: [{ stage: 'TRT', subject: 'Typical areas', topics: ['General knowledge and current affairs', 'Perspectives in education', 'Child development and pedagogy', 'Subject content and methodology'] }] },
    syllabusTags: ['teaching-pedagogy', 'teaching-subject', 'current-affairs', 'telugu-language', 'english-language'],
    statistics: [{ year: 2024, vacancies: 11062, note: 'As reported for DSC 2024.', source: 's1' }],
    salary: { payRuleSet: 'ts-rps-2020', payLevel: 'TS RPS 2020', payScale: null, startingBasic: null, pension: 'Contributory Pension Scheme.', notes: 'Teacher scales by post are in the notification.' },
    career: { progression: [{ post: 'SGT', level: 'RPS 2020', timeline: 'Entry', timelineType: 'official' }, { post: 'School Assistant, Headmaster', level: 'Higher scales', timeline: 'By promotion', timelineType: 'typical' }], sources: ['s1'] },
    workLife: { postings: 'Schools in your district, often rural.', transfers: 'Under the transfer policy.', nature: 'Teaching.', workload: 'Moderate.', publicInteraction: 'High.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Many TET-qualified candidates compete for district-wise posts.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'high', recruitmentRegularity: 'low', rationale: 'District posting; DSC is irregular.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'Years between DSCs.' }] },
    sources: [['s1', 'TSPSC TRT / TG DSC overview and vacancies', 'https://teachersbadi.in/tspsc-trt/', 'Teachersbadi', 2024, 'secondary']],
    dataQuality: { confidence: 'low', gaps: ['Official DSC 2024 notification not read; vacancy count as reported.', 'Age, pay and exam pattern not verified.'], notes: 'Indicative profile for a recurring route.' },
  },
]
