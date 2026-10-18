/**
 * Batch: TGPSC AEE (Civil) R&B (Notification 01/G/RB/2026, official) and TG TET
 * (June 2026 session, from a report of the official notification).
 */
const tgpsc = { id: 'tgpsc', name: 'Telangana Public Service Commission (formerly TSPSC)', abbreviation: 'TGPSC', website: 'https://www.tgpsc.gov.in' }
const tsSchool = { id: 'ts-school-education', name: 'Department of School Education, Telangana', abbreviation: 'TG School Education', website: 'https://schooledu.telangana.gov.in' }
const tsRelax = [{ category: 'SC, ST, BC and EWS', years: 5 }, { category: 'PwBD', years: 10 }, { category: 'Telangana State Government employees', years: 5, note: 'Based on service.' }]

export default [
  {
    id: 'tgpsc-aee', name: 'TGPSC Assistant Executive Engineer (Civil), Roads and Buildings', abbreviation: 'TGPSC AEE', jurisdiction: 'telangana', sector: 'engineering-psu', technical: true, organization: tgpsc,
    department: 'Transport, Roads and Buildings Department, Telangana', summary: 'Gazetted Assistant Executive Engineer (Civil) posts in Telangana Roads and Buildings, filled multi-zone wise through a two-paper objective exam (450 marks). No interview.',
    recruitmentMethods: ['competitive-exam', 'document-verification'], frequency: 'Irregular (department-wise notifications)',
    officialLinks: [{ label: 'TGPSC notifications', url: 'https://websitenew.tgpsc.gov.in/directRecruitment' }],
    status: { type: 'active', note: 'Notification 01/G/RB/2026 (222 posts): applications 6 June to 13 July 2026; exam tentatively October 2026. A separate notice 02/G/RB/2026 covers AEE (Electrical).', cycles: [{ cycle: 'Notification 01/G/RB/2026', events: [
      { event: 'Notification', date: '2026-06-02', dateType: 'official', source: 's1' },
      { event: 'Applications open', date: '2026-06-06', dateType: 'official', source: 's1' },
      { event: 'Last date to apply (5 PM)', date: '2026-07-13', dateType: 'official', source: 's1' },
      { event: 'Written exam', date: '2026-10', dateType: 'official-tentative', source: 's1' }] }] },
    posts: [{ name: 'Assistant Executive Engineer (Civil), R&B', group: 'Gazetted (multi-zone)', payLevel: 'TS RPS 2020', startingBasic: 54220, responsibilities: 'Roads and buildings construction and maintenance.', notes: '222 posts.' }],
    eligibility: {
      age: { summary: '18 to 44 on 1 July 2026. G.O.Ms.No.86 GA (Ser.A) of 18 May 2026 raised the upper age limit by 10 years, from 34 to 44.', referenceDate: '1 July 2026', relaxations: tsRelax },
      nationality: 'Citizen of India.', domicile: 'Multi-zone post; local reservation under the Presidential Order 2018.',
      education: { summary: 'A degree in Civil Engineering (as specified in the notification).', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
    },
    eligibilityRules: { ageMin: 18, ageMax: 44, ageReferenceDate: '2026-07-01', minEducation: 'graduate', educationFields: ['engineering-civil'], relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }, domicile: 'telangana' },
    selection: { stages: [{ name: 'Written exam (objective, OMR or CBRT)', type: 'objective', countsInMerit: true, papers: [
      { name: 'Paper I: General Studies and General Abilities', marks: 150, questions: 150, duration: '150 minutes' },
      { name: 'Paper II: Civil Engineering (degree level)', marks: 300, questions: 150, duration: '150 minutes' }], notes: 'Normalization if held in multiple sessions; marks computed to three decimals.' }],
      meritCalculation: 'Selection on the 450-mark exam. Minimum marks: OC, sportspersons and EWS 40%; BC 35%; SC, ST and PH 30%.', languages: 'As per notification.', documentVerification: 'After results.', probation: 'As per TS rules.' },
    syllabus: { officialLink: 'https://websitenew.tgpsc.gov.in/directRecruitment', sections: [{ stage: 'Written', subject: 'Two papers', topics: ['General studies and general abilities (Telangana focus)', 'Civil engineering at degree level'] }] },
    syllabusTags: ['general-awareness', 'reasoning', 'telangana-history-culture', 'telangana-movement', 'engineering-civil'],
    statistics: [{ year: 2026, vacancies: 222, note: 'Notification 01/G/RB/2026.', source: 's1' }],
    salary: { payRuleSet: 'ts-rps-2020', payLevel: 'TS RPS 2020', payScale: '54,220 to 1,33,630', startingBasic: 54220, pension: 'Contributory Pension Scheme.', increments: 'Annual increment.' },
    career: { progression: [{ post: 'Assistant Executive Engineer', level: 'RPS 2020', timeline: 'Entry', timelineType: 'official' }, { post: 'Deputy Executive Engineer', level: 'Higher scale', timeline: 'By promotion', timelineType: 'typical' }, { post: 'Executive Engineer', level: 'Higher scale', timeline: 'Senior', timelineType: 'typical' }], departmentalExams: 'TGPSC departmental tests.', sources: ['s1'] },
    workLife: { postings: 'Divisions across Telangana by multi-zone.', transfers: 'Periodic.', nature: 'Field engineering.', workload: 'High.', publicInteraction: 'Moderate.', hazards: 'Site risks.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'medium', timePressure: 'medium', technicalComplexity: 'high', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Civil engineering carries two-thirds of the marks; a reasonable number of posts.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Gazetted entry; notified irregularly by department.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'Department notices come years apart.' }] },
    sources: [['s1', 'TGPSC Notification No. 01/G/RB/2026: AEE (Civil) in Transport, Roads and Buildings Department', 'https://websitenew.tgpsc.gov.in/directRecruitment', 'Telangana Public Service Commission', 2026]],
    dataQuality: { confidence: 'high', gaps: ['Exact exam date not yet announced.'], notes: 'From the official notification.' },
  },
  {
    id: 'tg-tet', name: 'Telangana Teacher Eligibility Test', abbreviation: 'TG TET', profileType: 'eligibility-test', jurisdiction: 'telangana', sector: 'teaching', organization: tsSchool, employmentType: 'eligibility-only',
    department: 'Department of School Education, Telangana', summary: 'Qualifying test needed to become a government school teacher in Telangana. Paper I is for primary classes and Paper II for upper primary. It is not a job itself, but the TET score carries 20% weightage in the Teacher Recruitment Test (DSC).',
    recruitmentMethods: ['eligibility-test'], frequency: 'Twice a year (recent pattern)',
    officialLinks: [{ label: 'TG TET portal', url: 'https://tgtet.aptonline.in' }, { label: 'School Education', url: 'https://schooledu.telangana.gov.in' }],
    status: { type: 'recurring', note: 'Held twice a year recently. June 2026 session: notification 13 April 2026, applications 15 to 30 April, CBT 15 to 30 June 2026.', cycles: [{ cycle: 'TG TET June 2026', events: [
      { event: 'Notification', date: '2026-04-13', dateType: 'official', source: 's1' },
      { event: 'Applications open', date: '2026-04-15', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-04-30', dateType: 'official', source: 's1' },
      { event: 'Computer-based test begins', date: '2026-06-15', dateType: 'official', source: 's1' }] }] },
    posts: [{ name: 'TET qualification (Paper I and/or Paper II)', group: 'Eligibility certificate', payLevel: null, startingBasic: null, responsibilities: 'Makes you eligible for teacher recruitment in Telangana.' }],
    eligibility: {
      age: { summary: 'Minimum 18 years; no upper limit for the TET itself.', referenceDate: 'As per notification', relaxations: [] },
      nationality: 'As per notification.',
      education: { summary: 'Paper I: Intermediate with a D.El.Ed (or equivalent teacher training). Paper II: a degree with B.Ed (or equivalent). Exact combinations follow NCTE norms listed in the notification.', finalYearAllowed: true, minMarks: 'As per NCTE norms in the notification' },
      attempts: [{ category: 'All', limit: 'No limit; you may retake to improve your score' }],
      examVsPost: 'Passing TET does not give a job. You must then take the DSC / Teacher Recruitment Test, where the TET score is 20% of the merit.',
    },
    eligibilityRules: { ageMin: 18, ageMax: null, minEducation: 'class-12', educationFields: ['education'], finalYearAllowed: true, relaxationYears: { OBC: 0, SC: 0, ST: 0, EWS: 0, PwBD: 0 }, notes: 'Needs D.El.Ed (Paper I) or B.Ed with a degree (Paper II).' },
    selection: { stages: [{ name: 'Computer-based test', type: 'objective', countsInMerit: false, notes: 'No negative marking. Paper I and Paper II are separate; you can take one or both.' }],
      meritCalculation: 'Qualifying test; the score carries 20% weightage in the Teacher Recruitment Test.', languages: 'English, Telugu and other languages as per notification.', documentVerification: 'At DSC stage.', probation: 'Not applicable.' },
    syllabus: { officialLink: 'https://tgtet.aptonline.in', sections: [{ stage: 'Paper I and II', subject: 'Typical areas', topics: ['Child development and pedagogy', 'Languages (Telugu or other first language, English)', 'Mathematics and environmental studies (Paper I)', 'Maths and science or social studies (Paper II)'] }] },
    syllabusTags: ['teaching-pedagogy', 'teaching-subject', 'telugu-language', 'english-language', 'mathematics', 'general-science'],
    statistics: [],
    salary: { payRuleSet: 'other', payLevel: null, payScale: null, startingBasic: null, notes: 'No salary: this is an eligibility test.' },
    career: { progression: [{ post: 'Teacher (after DSC selection)', level: 'TS RPS 2020', timeline: 'After TRT/DSC', timelineType: 'typical' }], promotionNotes: 'See teacher recruitment (DSC).', sources: ['s1'] },
    workLife: { postings: 'Not applicable.', transfers: 'Not applicable.', nature: 'Not applicable.', workload: 'Not applicable.', publicInteraction: 'Not applicable.', hazards: 'Not applicable.', stability: 'Not applicable.' },
    difficulty: { syllabusDepth: 'medium', competition: 'low', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'low', rationale: 'Qualifying test; your score matters for DSC merit.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'high', recruitmentRegularity: 'high', rationale: 'Held often; the job depends on DSC notifications.' },
    risk: { overall: 'low', factors: [{ factor: 'No job guarantee', level: 'medium', note: 'Teacher posts depend on irregular DSC notifications.' }] },
    sources: [['s1', 'TG TET June 2026 notification released', 'https://competition.careers360.com/articles/tg-tet-june-session-2026-notification-released', 'Careers360 (reports the official notification)', 2026, 'secondary']],
    dataQuality: { confidence: 'medium', gaps: ['Paper-wise question and marks breakdown not confirmed from the official notification.', 'Pass marks by category not confirmed.'], notes: 'Dates and fee from a secondary report.' },
  },
]
