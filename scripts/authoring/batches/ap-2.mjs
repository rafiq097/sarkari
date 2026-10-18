/**
 * Batch: AP SLPRB Police SI and Constable (notifications of 16 Sep 2026) and APPSC AEE
 * (Brief Notification 27/2026). SLPRB details from a report of the notifications
 * (official press note is a scanned image); AEE from the official APPSC notice.
 */
const slprb = { id: 'slprb-ap', name: 'State Level Police Recruitment Board, Andhra Pradesh', abbreviation: 'SLPRB AP', website: 'https://slprb.ap.gov.in' }
const appsc = { id: 'appsc', name: 'Andhra Pradesh Public Service Commission', abbreviation: 'APPSC', website: 'https://psc.ap.gov.in' }
const report = ['s1', 'AP Police Recruitment 2026: SLPRB announces 2,050 SI, Constable, Fireman and other vacancies (six notifications of 16 Sep 2026)', 'https://www.sarkarijobs.com/ap-police-recruitment-2026-notice-out-slprb-announces-2050-si-constable-fireman-and-other-vacancies/', 'SarkariJobs (reports the SLPRB notifications)', 2026, 'secondary']
const pressNote = ['s2', 'SLPRB AP press note, 16 Sep 2026', 'https://slprb.ap.gov.in/2026_PDFS/PressNote_dated_16092026.pdf', 'State Level Police Recruitment Board, AP', 2026]
const apPoliceReservation = 'AP reservation (SC, ST, BC A to E, EWS) with 33 1/3% horizontal reservation for women in civil posts, plus local cadre (district / zone) rules.'
const apRelax = [{ category: 'SC, ST, BC and EWS', years: 5 }, { category: 'Ex-servicemen and others', years: null, note: 'As per notification.' }]
const policeStages = [
  { name: 'Preliminary Written Test', type: 'objective', countsInMerit: false, notes: 'Qualifying. Minimum 40% (OC, EWS), 35% (BC), 30% (SC, ST).' },
  { name: 'Physical Measurement Test', type: 'physical', countsInMerit: false },
  { name: 'Physical Efficiency Test', type: 'physical', countsInMerit: false, notes: 'Includes a qualifying 1,600 m run.' },
  { name: 'Final Written Examination', type: 'objective', countsInMerit: true },
  { name: 'Certificate verification and medical', type: 'document', countsInMerit: false }]

export default [
  {
    id: 'ap-police-si', name: 'AP Police Sub-Inspector (Civil, AR and others)', abbreviation: 'AP Police SI', jurisdiction: 'andhra-pradesh', sector: 'capf-police', organization: slprb,
    department: 'Andhra Pradesh Police', summary: 'Graduate entry as Stipendiary Cadet Trainee Sub-Inspector in AP Police: Civil, Armed Reserve, Special Protection Force and technical SI posts. Preliminary test, physical tests, final written exam.',
    recruitmentMethods: ['competitive-exam', 'physical-test', 'medical-exam', 'document-verification'], frequency: 'Irregular (2018, 2022, 2026 cycles)',
    officialLinks: [{ label: 'SLPRB AP', url: 'https://slprb.ap.gov.in' }],
    status: { type: 'active', note: 'Notifications 81 and 82/SLPRB/2026 issued on 16 September 2026. Application dates to be announced by press release.', cycles: [{ cycle: '2026 recruitment', events: [{ event: 'Notifications issued', date: '2026-09-16', dateType: 'official', source: 's2' }] }] },
    posts: [
      { name: 'SCT SI (Civil), men and women', group: 'Non-gazetted', payLevel: 'RPS 2022', startingBasic: 44570, responsibilities: 'Station house officer duties, investigation, law and order.', notes: '253 posts.' },
      { name: 'SCT Reserve SI (AR), men and women', group: 'Non-gazetted', payLevel: 'RPS 2022', startingBasic: 44570, responsibilities: 'Armed reserve platoon command.', notes: '116 posts.' },
      { name: 'SI (Men), Special Protection Force', group: 'Non-gazetted', payLevel: 'RPS 2022', startingBasic: 44570, responsibilities: 'Security of installations.', notes: '9 posts.' },
      { name: 'SCT SI (Communications)', group: 'Non-gazetted', payLevel: 'RPS 2022', startingBasic: 45830, responsibilities: 'Police communications.', notes: '50 posts. Diploma or B.Tech in ECE, EEE, CSE or IT, or B.Sc Electronics.' },
      { name: 'SCT SI (Police Transport Organisation), men', group: 'Non-gazetted', payLevel: 'RPS 2022', startingBasic: 44570, responsibilities: 'Police vehicle fleet.', notes: '10 posts. Diploma in Electrical, Mechanical or Automobile Engineering.' }],
    eligibility: {
      age: { summary: '21 to 27 years on 1 July 2026.', referenceDate: '1 July 2026', relaxations: apRelax },
      nationality: 'Citizen of India.', domicile: 'Local cadre rules apply.',
      education: { summary: 'A bachelor\'s degree (Civil, AR, SPF). Technical SI posts need the diplomas or degrees listed above.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      physical: 'Physical Measurement Test and Physical Efficiency Test (a qualifying 1,600 m run among others). Eyesight: distant vision 6/6 in both eyes; colour blindness and squint disqualify.',
      reservation: apPoliceReservation,
    },
    eligibilityRules: { ageMin: 21, ageMax: 27, ageReferenceDate: '2026-07-01', minEducation: 'graduate', relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 0 }, domicile: 'andhra-pradesh', notes: 'Physical tests. Technical SI posts accept diplomas.' },
    selection: { stages: policeStages, meritCalculation: 'Merit from the Final Written Examination among candidates who clear the qualifying stages.', languages: 'English and Telugu.', documentVerification: 'After the final written exam.', probation: 'Training at the AP Police Academy with stipend, then probation.' },
    syllabus: { officialLink: null, sections: [{ stage: 'Written tests', subject: 'Typical papers', topics: ['Arithmetic and reasoning / mental ability', 'General studies', 'English and Telugu (qualifying where specified)'] }] },
    syllabusTags: ['quantitative-aptitude', 'reasoning', 'general-awareness', 'ap-history-culture', 'english-language', 'telugu-language', 'physical-fitness'],
    statistics: [{ year: 2026, vacancies: 438, note: 'Notifications 81 (378) and 82 (60) of 2026.', source: 's1' }],
    salary: { payRuleSet: 'ap-rps-2022', payLevel: 'AP RPS 2022', payScale: '44,570 to 1,27,480', startingBasic: 44570, pension: 'Contributory Pension Scheme.', increments: 'Annual increment.', notes: 'Stipend during training; regular pay after training.' },
    career: { progression: [{ post: 'Sub-Inspector', level: 'RPS 2022', timeline: 'Entry', timelineType: 'official' }, { post: 'Inspector', level: 'Higher scale', timeline: 'By promotion', timelineType: 'typical' }, { post: 'DSP', level: 'Group-I scale', timeline: 'Senior', timelineType: 'typical' }], promotionNotes: 'Seniority and departmental tests.', sources: ['s1'] },
    benefits: [{ item: 'Police benefits', detail: 'Uniform, quarters where available, police health schemes as per AP rules.', conditional: true, sources: ['s1'] }],
    workLife: { postings: 'Police stations and units across the zone.', transfers: 'Frequent.', nature: 'Field policing.', workload: 'Very high.', publicInteraction: 'Very high.', hazards: 'Moderate to high.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'high', selectionUncertainty: 'medium', rationale: 'Several elimination stages including physical tests for a few hundred posts.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Recruitment comes every few years.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'Gaps of several years.' }, { factor: 'Litigation', level: 'medium', note: 'The 2022 cycle results were revised after court cases.' }] },
    sources: [report, pressNote],
    dataQuality: { confidence: 'medium', gaps: ['Official notification text not machine-readable; details from a secondary report.', 'PET and PMT figures not reproduced.', 'Exam marks per paper not confirmed.'], notes: 'Indicative.' },
  },
  {
    id: 'ap-police-constable', name: 'AP Police Constable (Civil, AR) and related posts', abbreviation: 'AP Police Constable', jurisdiction: 'andhra-pradesh', sector: 'capf-police', organization: slprb,
    department: 'Andhra Pradesh Police, Fire Services and Prisons', summary: 'Intermediate-level recruitment of Stipendiary Cadet Trainee Police Constables (Civil and AR), Firemen and Jail Warders in Andhra Pradesh. Preliminary test, physical tests and a final written exam.',
    recruitmentMethods: ['competitive-exam', 'physical-test', 'medical-exam', 'document-verification'], frequency: 'Irregular',
    officialLinks: [{ label: 'SLPRB AP', url: 'https://slprb.ap.gov.in' }],
    status: { type: 'active', note: 'Notification 91/SLPRB/2026 (1,156 posts) issued on 16 September 2026; application dates to be announced.', cycles: [{ cycle: '2026 recruitment', events: [{ event: 'Notifications issued', date: '2026-09-16', dateType: 'official', source: 's2' }] }] },
    posts: [
      { name: 'SCT Police Constable (Civil)', group: 'Non-gazetted', payLevel: 'RPS 2022', startingBasic: 25220, ageMax: 24, responsibilities: 'Police station duties.', notes: '542 posts.' },
      { name: 'SCT Police Constable (AR)', group: 'Non-gazetted', payLevel: 'RPS 2022', startingBasic: 25220, ageMax: 24, responsibilities: 'Armed reserve duties.', notes: '285 posts.' },
      { name: 'Fireman (Disaster Response and Fire Services)', group: 'Non-gazetted', payLevel: 'RPS 2022', startingBasic: 25220, ageMax: 32, responsibilities: 'Firefighting and rescue.', notes: '158 posts.' },
      { name: 'Warder (Men / Women), Prisons', group: 'Non-gazetted', payLevel: 'RPS 2022', startingBasic: 25220, ageMax: 32, responsibilities: 'Prison security.', notes: '150 men, 21 women.' }],
    eligibility: {
      age: { summary: 'Constables 18 to 24; Firemen and Warders 18 to 32; on 1 July 2026.', referenceDate: '1 July 2026', relaxations: apRelax },
      nationality: 'Citizen of India.', domicile: 'Local cadre rules apply.',
      education: { summary: 'Intermediate (Class 12) or equivalent. SC and ST candidates meeting the SSC-plus-Intermediate study condition in the notification may also qualify.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      physical: 'PMT and PET, with a qualifying 1,600 m run; eyesight standards apply.',
      reservation: apPoliceReservation,
    },
    eligibilityRules: { ageMin: 18, ageMax: 32, ageReferenceDate: '2026-07-01', minEducation: 'class-12', relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 0 }, domicile: 'andhra-pradesh', notes: 'Constable posts close at 24; Fireman and Warder at 32.' },
    selection: { stages: policeStages, meritCalculation: 'Merit from the Final Written Examination.', languages: 'English and Telugu.', documentVerification: 'After the final exam.', probation: 'Training with stipend.' },
    syllabus: { officialLink: null, sections: [{ stage: 'Written tests', subject: 'Typical papers', topics: ['Arithmetic and reasoning', 'General studies including AP-specific topics'] }] },
    syllabusTags: ['quantitative-aptitude', 'reasoning', 'general-awareness', 'ap-history-culture', 'physical-fitness'],
    statistics: [{ year: 2026, vacancies: 1156, note: 'Notification 91/SLPRB/2026.', source: 's1' }],
    salary: { payRuleSet: 'ap-rps-2022', payLevel: 'AP RPS 2022', payScale: '25,220 to 80,910', startingBasic: 25220, pension: 'Contributory Pension Scheme.', increments: 'Annual increment.', notes: 'Stipend during training.' },
    career: { progression: [{ post: 'Constable', level: 'RPS 2022', timeline: 'Entry', timelineType: 'official' }, { post: 'Head Constable', level: 'Higher scale', timeline: 'By promotion', timelineType: 'typical' }, { post: 'ASI / SI', level: 'Higher scale', timeline: 'Mid career', timelineType: 'typical' }], sources: ['s1'] },
    workLife: { postings: 'Within the district or unit.', transfers: 'Within district/zone.', nature: 'Field duty.', workload: 'Very high.', publicInteraction: 'Very high.', hazards: 'Moderate.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'low', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'high', selectionUncertainty: 'medium', rationale: 'Easy syllabus; physical tests and lakhs of applicants decide.' },
    ratings: { careerGrowth: 'low', locationFlexibility: 'high', recruitmentRegularity: 'low', rationale: 'You stay in your district or zone; recruitment every few years.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'Several years between cycles.' }] },
    sources: [report, pressNote],
    dataQuality: { confidence: 'medium', gaps: ['Official notification text not machine-readable; details from a secondary report.', 'PET/PMT figures not reproduced.'], notes: 'Indicative.' },
  },
  {
    id: 'appsc-aee', name: 'APPSC Assistant Executive Engineers in Engineering Services', abbreviation: 'APPSC AEE', jurisdiction: 'andhra-pradesh', sector: 'engineering-psu', technical: true, organization: appsc,
    department: 'AP Water Resources, Panchayat Raj, Rural Water Supply, Roads and Buildings, Public Health, Tribal Welfare engineering departments',
    summary: 'Gazetted Assistant Executive Engineer posts across Andhra Pradesh engineering departments, mostly Civil (Water Resources alone has 224). One computer-based exam of three papers (450 marks); no Screening test and no interview.',
    recruitmentMethods: ['competitive-exam', 'document-verification'], frequency: 'Irregular',
    officialLinks: [{ label: 'Brief Notification 27/2026', url: 'https://psc.ap.gov.in/Documents/NotificationDocuments/AEE_Revised_272026.pdf' }],
    status: { type: 'active', note: 'Brief Notification 27/2026 issued 13 October 2026; applications 2 to 22 November 2026.', cycles: [{ cycle: 'Notification 27/2026', events: [
      { event: 'Brief notification', date: '2026-10-13', dateType: 'official', source: 's1' },
      { event: 'Applications open', date: '2026-11-02', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-11-22', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'AEE (Civil), Water Resources', group: 'Gazetted', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Irrigation projects and canals.', notes: '224 posts.' },
      { name: 'AEE, Panchayat Raj and Rural Development Engineering', group: 'Gazetted', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Rural roads and buildings.', notes: '100 posts.' },
      { name: 'AEE (Civil), Roads and Buildings', group: 'Gazetted', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'State roads and buildings.', notes: '75 posts.' },
      { name: 'AEE, Rural Water Supply and Sanitation', group: 'Gazetted', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Drinking water schemes.', notes: '73 posts.' },
      { name: 'AEE, Public Health and Municipal Engineering', group: 'Gazetted', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Urban water and sewerage.', notes: '21 posts.' },
      { name: 'AEE, Tribal Welfare Engineering', group: 'Gazetted', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Tribal area works.', notes: '6 posts.' },
      { name: 'AEE (Electrical), Roads and Buildings', group: 'Gazetted', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Electrical works.', notes: '4 posts.' },
      { name: 'AEE (Mechanical), Water Resources', group: 'Gazetted', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Mechanical works in irrigation.', notes: 'Vacancies per notification.' }],
    eligibility: {
      age: { summary: '18 to 44 years on 1 July 2026.', referenceDate: '1 July 2026', relaxations: apRelax },
      nationality: 'Citizen of India.', domicile: 'Local cadre and zonal rules apply.',
      education: { summary: 'A bachelor\'s degree in the relevant branch of engineering (Civil, Mechanical or Electrical, as per post), held by the date of the detailed notification.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
    },
    eligibilityRules: { ageMin: 18, ageMax: 44, ageReferenceDate: '2026-07-01', minEducation: 'graduate', educationFields: ['engineering-civil', 'engineering-mechanical', 'engineering-electrical'], relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }, domicile: 'andhra-pradesh' },
    selection: { stages: [{ name: 'Written exam (CBRT, objective)', type: 'objective', countsInMerit: true, papers: [
      { name: 'Paper 1: General Studies and Mental Ability (common)', marks: 150, questions: 150, duration: '150 minutes', negative: 'One third' },
      { name: 'Paper 2: Civil and Mechanical Engineering (or Electrical for R&B Electrical)', marks: 150, questions: 150, duration: '150 minutes', negative: 'One third' },
      { name: 'Paper 3: Civil Engineering (or the branch of the post)', marks: 150, questions: 150, duration: '150 minutes', negative: 'One third' }], notes: 'Single-level exam; no Screening test regardless of applications. Normalization if held in multiple sessions.' }],
      meritCalculation: 'Merit on the 450-mark written exam.', languages: 'English (with Telugu translation as per notification).', documentVerification: 'After the exam.', probation: 'As per AP rules.' },
    syllabus: { officialLink: 'https://psc.ap.gov.in/Documents/NotificationDocuments/AEE_Revised_272026.pdf', sections: [{ stage: 'Written', subject: 'Papers', topics: ['General studies and mental ability', 'Civil and mechanical engineering fundamentals', 'Civil engineering (or branch subject) in depth'] }] },
    syllabusTags: ['general-awareness', 'reasoning', 'ap-history-culture', 'engineering-civil', 'engineering-mechanical', 'engineering-electrical'],
    statistics: [{ year: 2026, vacancies: 503, note: 'Sum of listed posts in the brief notification excluding AEE (Mech), whose count was not legible.', source: 's1' }],
    salary: { payRuleSet: 'ap-rps-2022', payLevel: 'AP RPS 2022', payScale: '57,100 to 1,47,760', startingBasic: 57100, pension: 'Contributory Pension Scheme.', increments: 'Annual increment.' },
    career: { progression: [{ post: 'Assistant Executive Engineer', level: 'RPS 2022', timeline: 'Entry', timelineType: 'official' }, { post: 'Deputy Executive Engineer', level: 'Higher scale', timeline: 'By promotion', timelineType: 'typical' }, { post: 'Executive Engineer / Superintending Engineer', level: 'Higher scales', timeline: 'Senior', timelineType: 'typical' }], promotionNotes: 'Departmental tests required for promotion.', departmentalExams: 'APPSC departmental tests.', sources: ['s1'] },
    workLife: { postings: 'Project and division offices across AP.', transfers: 'Periodic.', nature: 'Field engineering.', workload: 'High during project seasons.', publicInteraction: 'Moderate.', hazards: 'Site risks.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'medium', timePressure: 'medium', technicalComplexity: 'high', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Degree-level engineering papers with a general studies paper; a large number of posts this cycle.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Good gazetted engineering entry, notified irregularly.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'Every few years.' }] },
    sources: [['s1', 'APPSC Brief Notification No. 27/2026: Assistant Executive Engineers', 'https://psc.ap.gov.in/Documents/NotificationDocuments/AEE_Revised_272026.pdf', 'Andhra Pradesh Public Service Commission', 2026]],
    dataQuality: { confidence: 'high', gaps: ['AEE (Mech) vacancy count not legible.', 'Detailed notification (community break-up) not read.'], notes: 'From the official brief notification.' },
  },
]
