/**
 * Batch: Telangana gurukul teachers (TREIRB, 2023 cycle of 9,210 posts) and MHSRB
 * Nursing Officer (Staff Nurse, 2024 cycle of 2,322 posts). Both from secondary reports.
 */
const treirb = { id: 'treirb', name: 'Telangana Residential Educational Institutions Recruitment Board', abbreviation: 'TREIRB', website: 'https://treirb.telangana.gov.in' }
const mhsrb = { id: 'mhsrb-telangana', name: 'Medical and Health Services Recruitment Board, Telangana', abbreviation: 'MHSRB', website: 'https://mhsrb.telangana.gov.in' }
const tsReservation = 'Telangana rules: SC 15% (sub-categorised from 2025), ST 10%, BC 29%, EWS 10%, with horizontal reservation for women, PwBD, ex-servicemen and sportspersons, and local-cadre rules under the Presidential Order 2018.'
const tsRelax = [{ category: 'SC, ST, BC and EWS', years: 5 }, { category: 'PwBD', years: 10 }, { category: 'Telangana State Government employees', years: 5, note: 'Based on regular service.' }, { category: 'Ex-servicemen, NCC instructors', years: 3, note: 'Plus length of service.' }]
const tsRelaxYears = { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }

export default [
  {
    id: 'tg-gurukul-treirb', name: 'Telangana Gurukul Teachers and Lecturers (TREIRB)', abbreviation: 'TG Gurukul', jurisdiction: 'telangana', sector: 'teaching', organization: treirb,
    department: 'Telangana residential (gurukul) school and college societies: Social Welfare, Tribal Welfare, BC Welfare, Minority Welfare and General', summary: 'Teacher and lecturer posts in Telangana\'s residential gurukul schools and colleges. The 2023 drive had 9,210 posts: 4,006 TGT, 1,276 PGT, 2,008 junior college and 868 degree college posts, plus PD, librarian and art teachers.',
    recruitmentMethods: ['competitive-exam', 'skill-test', 'document-verification'], frequency: 'Irregular (2017, 2023)',
    officialLinks: [{ label: 'TREIRB website', url: 'https://treirb.telangana.gov.in' }],
    status: { type: 'recurring', note: 'The last cycle was notified in April 2023 (9,210 posts), with written exams in August 2023 and results from February 2024. Large TREIRB drives have come years apart (2017, 2023).', cycles: [{ cycle: 'TREIRB 2023', events: [
      { event: 'Applications open (degree and junior college posts)', date: '2023-04-17', dateType: 'official', source: 's1' },
      { event: 'Written exams begin', date: '2023-08-01', dateType: 'official', source: 's2' },
      { event: 'TGT and PGT results', date: '2024-02-08', dateType: 'official', source: 's2' }] }] },
    posts: [
      { name: 'Trained Graduate Teacher (TGT)', group: 'School', payLevel: 'TS RPS 2020', startingBasic: 42300, responsibilities: 'Teaches Classes VI to X in gurukul schools.', notes: '2023: 4,006 posts. Scale 42,300 to 1,15,270. Needs B.Ed and TET Paper II.' },
      { name: 'Post Graduate Teacher (PGT)', group: 'School', payLevel: 'TS RPS 2020', startingBasic: 45960, responsibilities: 'Teaches senior classes in gurukul schools.', notes: '2023: 1,276 posts. Scale 45,960 to 1,24,150.' },
      { name: 'Junior Lecturer, Physical Director and Librarian (junior colleges)', group: 'Junior college', payLevel: 'TS RPS 2020', startingBasic: 54220, responsibilities: 'Teaches intermediate (Class 11 and 12) students.', notes: '2023: 2,008 posts. Scale 54,220 to 1,33,630.' },
      { name: 'Degree Lecturer, Physical Director and Librarian (degree colleges)', group: 'Degree college', payLevel: 'TS RPS 2020', startingBasic: 58850, responsibilities: 'Teaches in gurukul degree colleges.', notes: '2023: 868 posts. Scale 58,850 to 1,37,050. Needs NET or PhD.' },
      { name: 'School Librarian, Physical Director, Art, Craft and Music Teachers', group: 'School', payLevel: 'TS RPS 2020', startingBasic: null, responsibilities: 'Library, sports and arts teaching.', notes: '2023: 434 librarians, 275 PDs, 132 art, 88 craft and 123 music teachers.' }],
    eligibility: {
      age: { summary: '18 to 44 years (2023 cycle).', referenceDate: 'As per notification', relaxations: tsRelax },
      nationality: 'Citizen of India.', domicile: 'Local-cadre rules apply under the Presidential Order 2018.',
      education: { summary: 'TGT: a degree with 50%, B.Ed and TET Paper II. PGT: a postgraduate degree with B.Ed. Junior Lecturer: a postgraduate degree with 50% (45% reserved) and B.Ed. Degree Lecturer: a postgraduate degree with NET (PhD holders exempt).', finalYearAllowed: false, minMarks: '50% in the qualifying degree for most posts' },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      reservation: tsReservation,
    },
    eligibilityRules: { ageMin: 18, ageMax: 44, minEducation: 'graduate', educationFields: ['education'], relaxationYears: tsRelaxYears, domicile: 'telangana', notes: 'Figures from the 2023 cycle.' },
    selection: { stages: [
      { name: 'Written tests (Paper I, II and III by post, objective)', type: 'objective', countsInMerit: true },
      { name: 'Demonstration class (lecturers, PDs, art and music)', type: 'skill', countsInMerit: true },
      { name: 'Certificate verification', type: 'document', countsInMerit: false }],
      meritCalculation: 'Merit from the written papers, plus the demonstration for lecturer and some school posts.', languages: 'English and Telugu.', documentVerification: 'After results.', probation: 'As per society rules.' },
    syllabus: { officialLink: 'https://treirb.telangana.gov.in', sections: [{ stage: 'Written tests', subject: 'Typical areas', topics: ['General studies with Telangana focus', 'Pedagogy and teaching aptitude', 'Subject knowledge for the post', 'English language'] }] },
    syllabusTags: ['teaching-pedagogy', 'teaching-subject', 'general-awareness', 'telangana-history-culture', 'english-language'],
    statistics: [{ year: 2023, vacancies: 9210, note: 'All TREIRB posts in the 2023 drive.', source: 's1' }],
    salary: { payRuleSet: 'ts-rps-2020', payLevel: 'TS RPS 2020', payScale: 'TGT 42,300 to 1,15,270; PGT 45,960 to 1,24,150; JL 54,220 to 1,33,630; DL 58,850 to 1,37,050', startingBasic: 42300, pension: 'Contributory Pension Scheme.', notes: 'Starting basic shown is TGT.' },
    career: { progression: [{ post: 'TGT', level: 'TS RPS 2020', timeline: 'Entry', timelineType: 'official' }, { post: 'PGT / Principal', level: 'Higher scales', timeline: 'By promotion', timelineType: 'typical' }], promotionNotes: 'Promotions within each residential society.', sources: ['s1'] },
    benefits: [{ item: 'State government benefits', detail: 'HRA or quarters, Employees Health Scheme and leave as per Telangana rules.', conditional: false, sources: ['s1'] }],
    workLife: { postings: 'Residential schools and colleges across Telangana, many in rural areas.', transfers: 'Within the society.', nature: 'Teaching with residential duties.', workload: 'High.', publicInteraction: 'High.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Thousands of posts, but many lakh applications across posts.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Large drives come years apart.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'The last two drives were six years apart.' }] },
    sources: [
      ['s1', 'TS Gurukulam notification 2023 for 9,210 posts', 'https://www.freshersnow.com/ts-gurukulam-notification/', 'FreshersNow (reports the official notifications)', 2023, 'secondary'],
      ['s2', 'TREIRB results 2023', 'https://www.careerpower.in/blog/treirb-results-2023', 'Career Power', 2024, 'secondary']],
    dataQuality: { confidence: 'medium', gaps: ['Paper-wise marks not reproduced.', 'No 2026 notification confirmed.'], notes: 'From secondary reports of the 2023 notifications.' },
  },
  {
    id: 'tg-staff-nurse', name: 'Telangana Nursing Officer (Staff Nurse) Recruitment (MHSRB)', abbreviation: 'TG Staff Nurse', jurisdiction: 'telangana', sector: 'health', organization: mhsrb,
    department: 'Telangana health departments: Public Health, Medical Education, Vaidya Vidhana Parishad, AYUSH, MNJ Cancer Institute, Insurance Medical Services', summary: 'Nursing Officer (Staff Nurse) posts in Telangana government hospitals. The 2024 cycle filled 2,322 posts. Selection is 80 marks for a written test plus up to 20 marks for government contract or outsourced service.',
    recruitmentMethods: ['competitive-exam', 'document-verification'], frequency: 'Irregular (2022, 2024)',
    officialLinks: [{ label: 'MHSRB website', url: 'https://mhsrb.telangana.gov.in' }],
    status: { type: 'recurring', note: 'The 2024 cycle (2,050 posts, later 2,322) held its computer-based test in November 2024; the final merit list was due in April 2026. New cycles depend on posts being sanctioned (375 posts were reported approved in 2026).', cycles: [{ cycle: 'Nursing Officer 2024', events: [{ event: 'Final merit list', date: '2026-04-09', dateType: 'official', source: 's3' }] }] },
    posts: [{ name: 'Nursing Officer (Staff Nurse)', group: 'Non-gazetted', payLevel: 'TS RPS 2020', startingBasic: 36750, ageMin: 18, ageMax: 46, responsibilities: 'Ward nursing in government hospitals.', notes: '2024: 2,322 posts (1,576 Public Health and Medical Education, 332 TVVP, 61 AYUSH, 80 MNJ, 272 IMS, 1 Preventive Medicine).' }],
    eligibility: {
      age: { summary: '18 to 46 years.', referenceDate: 'As per notification', relaxations: tsRelax },
      nationality: 'Citizen of India.', domicile: 'Local-cadre rules apply.',
      education: { summary: 'GNM or B.Sc Nursing, with registration in the Telangana Nursing Council by the application date.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      reservation: tsReservation,
    },
    eligibilityRules: { ageMin: 18, ageMax: 46, minEducation: 'diploma', educationFields: ['nursing'], relaxationYears: tsRelaxYears, domicile: 'telangana', notes: 'Telangana Nursing Council registration needed.' },
    selection: { stages: [
      { name: 'Computer-based test', type: 'objective', countsInMerit: true, papers: [{ name: 'Nursing (80 questions)', marks: 80, questions: 80, duration: '1 hour' }], notes: 'English only, no negative marking.' },
      { name: 'Service weightage and certificate verification', type: 'document', countsInMerit: true, notes: 'Up to 20 marks for government contract or outsourced service: 2.5 per 6 months in tribal areas, 2 per 6 months elsewhere.' }],
      meritCalculation: 'Out of 100: written test 80 plus service weightage up to 20.', languages: 'English.', documentVerification: 'Before the final merit list.', probation: 'As per state rules.' },
    syllabus: { officialLink: 'https://mhsrb.telangana.gov.in', sections: [{ stage: 'CBT', subject: 'Nursing', topics: ['GNM and B.Sc Nursing syllabus: medical-surgical, community, child health, obstetric and mental health nursing'] }] },
    syllabusTags: ['nursing'],
    statistics: [{ year: 2024, vacancies: 2322, note: '2,050 notified, 272 added.', source: 's2' }],
    salary: { payRuleSet: 'ts-rps-2020', payLevel: 'TS RPS 2020', payScale: '36,750 to 1,06,990', startingBasic: 36750, pension: 'Contributory Pension Scheme.', notes: 'Scale as reported for the cycle.' },
    career: { progression: [{ post: 'Staff Nurse', level: 'TS RPS 2020', timeline: 'Entry', timelineType: 'official' }, { post: 'Head Nurse / Nursing Superintendent', level: 'Higher scales', timeline: 'By promotion', timelineType: 'typical' }], sources: ['s1'] },
    benefits: [{ item: 'State government benefits', detail: 'HRA, Employees Health Scheme and leave as per Telangana rules.', conditional: false, sources: ['s1'] }],
    workLife: { postings: 'Government hospitals across Telangana.', transfers: 'Periodic, within rules.', nature: 'Clinical nursing in shifts.', workload: 'High.', publicInteraction: 'Very high.', hazards: 'Moderate (infection exposure).', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'medium', technicalComplexity: 'medium', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Many nursing graduates apply; contract-service weightage helps those already working.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Large cycles, a few years apart.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'medium', note: 'Cycles depend on government approvals.' }] },
    sources: [
      ['s1', 'MHSRB Telangana Nursing Officer recruitment: age, pattern, weightage, pay', 'https://www.careerpower.in/blog/mhsrb-telangana-nursing-officer-recruitment', 'Career Power', 2026, 'secondary'],
      ['s2', 'MHSRB to hire 2,050 nursing officers', 'https://deccanchronicle.com/southern-states/telangana/mhsrb-to-hire-for-2050-nursing-officers-1824440', 'Deccan Chronicle', 2024, 'secondary'],
      ['s3', 'MHSRB Telangana Nursing Officer merit list 2026', 'https://www.mysarkarinaukri.com/en/mhsrb-telangana-nursing-officer-merit-list-2026/', 'MySarkariNaukri', 2026, 'secondary']],
    dataQuality: { confidence: 'medium', gaps: ['Exact CBT date of the 2024 cycle varies between reports.', 'Official notification not read directly.'], notes: 'From secondary reports.' },
  },
]
