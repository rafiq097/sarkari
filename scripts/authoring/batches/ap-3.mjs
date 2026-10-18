/**
 * Batch: AP DSC / APTRT 2026 (preliminary notification, secondary report) and APPSC
 * 2026 notifications: HWO Grade-II (25/2026), AMVI (36/2026), Assistant Statistical
 * Officer (20/2026), Horticulture Officer (19/2026). APPSC facts from official notices.
 */
const appsc = { id: 'appsc', name: 'Andhra Pradesh Public Service Commission', abbreviation: 'APPSC', website: 'https://psc.ap.gov.in' }
const apSchool = { id: 'ap-school-education', name: 'Department of School Education, Andhra Pradesh', abbreviation: 'AP School Education', website: 'https://cse.ap.gov.in' }
const docs = 'https://psc.ap.gov.in/Documents/NotificationDocuments'
const apRelax = [{ category: 'SC, ST, BC and EWS', years: 5 }, { category: 'PwBD', years: 10 }, { category: 'AP State Government employees', years: 5, note: 'Based on service.' }]
const relaxYears = { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }
const apReservation = 'AP rules: SC 15% (sub-categorised as per 2025 orders), ST 6%, BC 29% (A 7, B 10, C 1, D 7, E 4), EWS 10%, horizontal reservation for women (33 1/3%), PwBD, ex-servicemen; local cadre rules for zonal and district posts.'
const minMarks = 'Minimum to qualify: OC, EWS, sportspersons 40%; BC 35%; SC, ST, PwBD 30%.'
const irregular = { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'These posts are notified every few years.' }] }

/** Common APPSC single-exam profile builder for these posts. */
function appscPost({ id, name, abbreviation, sector, department, summary, number, notified, applyFrom, applyTo, file, post, vacancies, ageMin, ageMax, scale, startingBasic, education, educationRules, technical = false, paperTwo, tags, nature, cadre }) {
  return {
    id, name, abbreviation, jurisdiction: 'andhra-pradesh', sector, technical, organization: appsc, department, summary,
    recruitmentMethods: ['competitive-exam', 'skill-test', 'document-verification'], frequency: 'Irregular',
    officialLinks: [{ label: `Notification ${number}`, url: `${docs}/${file}` }],
    status: { type: 'active', note: `Notification ${number} issued on ${notified.split('-').reverse().join('/')}; applications ${applyFrom.split('-').reverse().join('/')} to ${applyTo.split('-').reverse().join('/')}. Exam date to be announced.`, cycles: [{ cycle: `Notification ${number}`, events: [
      { event: 'Notification', date: notified, dateType: 'official', source: 's1' },
      { event: 'Applications open', date: applyFrom, dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: applyTo, dateType: 'official', source: 's1' }] }] },
    posts: [{ name: post, group: cadre, payLevel: 'RPS 2022', startingBasic, responsibilities: nature, notes: `${vacancies} posts. Scale ${scale}.` }],
    eligibility: {
      age: { summary: `${ageMin} to ${ageMax} years on 1 July 2026.`, referenceDate: '1 July 2026', relaxations: apRelax },
      nationality: 'Citizen of India.', domicile: 'Local cadre rules apply.',
      education: { summary: education, finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }], reservation: apReservation,
    },
    eligibilityRules: { ageMin, ageMax, ageReferenceDate: '2026-07-01', minEducation: educationRules.level, educationFields: educationRules.fields, relaxationYears: relaxYears, domicile: 'andhra-pradesh' },
    selection: { stages: [
      { name: 'Written exam (objective)', type: 'objective', countsInMerit: true, papers: [
        { name: 'Paper I: General Studies and Mental Ability', marks: 150, questions: 150, duration: '150 minutes', negative: 'One third of the marks' },
        { name: `Paper II: ${paperTwo.name}`, marks: paperTwo.marks, questions: 150, duration: '150 minutes', negative: 'One third of the marks' }] },
      { name: 'Computer Proficiency Test', type: 'skill', countsInMerit: false, notes: 'Qualifying, where the notification prescribes it.' },
      { name: 'Certificate verification', type: 'document', countsInMerit: false }],
      meritCalculation: `Merit on the written exam. ${minMarks}`, tieBreaking: 'Equal marks are ranked by age (older first), as per APPSC rules.', languages: 'General Studies paper in English with Telugu translation.', documentVerification: 'After the exam.', probation: 'As per AP rules.' },
    syllabus: { officialLink: `${docs}/${file}`, sections: [{ stage: 'Written', subject: 'Two papers', topics: ['General studies and mental ability (AP focus)', paperTwo.name] }] },
    syllabusTags: ['general-awareness', 'current-affairs', 'reasoning', 'ap-history-culture', 'ap-economy-policy', ...tags],
    statistics: [{ year: 2026, vacancies, note: `Notification ${number}.`, source: 's1' }],
    salary: { payRuleSet: 'ap-rps-2022', payLevel: 'AP RPS 2022', payScale: scale, startingBasic, pension: 'Contributory Pension Scheme.', increments: 'Annual increment.' },
    career: { progression: [{ post, level: 'RPS 2022', timeline: 'Entry', timelineType: 'official' }], promotionNotes: 'Promotion by seniority and APPSC departmental tests.', departmentalExams: 'APPSC departmental tests.', sources: ['s1'] },
    workLife: { postings: cadre.includes('District') ? 'Within the district.' : 'Within the zone.', transfers: 'Periodic.', nature, workload: 'Moderate to high.', publicInteraction: 'High.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'medium', timePressure: 'medium', technicalComplexity: technical ? 'high' : 'medium', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'A general studies paper plus a subject paper; the subject degree requirement narrows the field.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Specialist state post, notified every few years.' },
    risk: irregular,
    sources: [['s1', `APPSC Notification No. ${number}: ${post}`, `${docs}/${file}`, 'Andhra Pradesh Public Service Commission', 2026]],
    dataQuality: { confidence: 'medium', gaps: ['Paper II marks and full syllabus not reproduced; see notification.', 'Community-wise vacancy break-up not reproduced.'], notes: 'Posts, age, pay and qualification from the official notification.' },
  }
}

export default [
  {
    id: 'ap-dsc', name: 'Andhra Pradesh Teacher Recruitment Test (DSC)', abbreviation: 'AP DSC', jurisdiction: 'andhra-pradesh', sector: 'teaching', organization: apSchool,
    department: 'School Education, Andhra Pradesh (government, ZP, MPP and municipal schools; special education; other education societies)',
    summary: 'Recruitment of government school teachers in Andhra Pradesh: Secondary Grade Teachers, School Assistants, TGT, PGT, Principals and physical education posts, through a computer-based Teacher Recruitment Test. Your AP TET score also counts towards merit.',
    recruitmentMethods: ['competitive-exam', 'document-verification'], frequency: 'Irregular (2018, 2025, 2026)',
    officialLinks: [{ label: 'TET-DSC portal', url: 'https://tet2dsc.apcfss.in' }, { label: 'School Education AP', url: 'https://cse.ap.gov.in' }],
    status: { type: 'active', note: 'Preliminary notification of 13 October 2026 for 2,721 tentative posts; detailed notification and exam dates due on or before 3 November 2026.', cycles: [{ cycle: 'AP DSC 2026', events: [
      { event: 'Preliminary notification', date: '2026-10-13', dateType: 'official', source: 's1' },
      { event: 'Detailed notification (on or before)', date: '2026-11-03', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Secondary Grade Teacher (SGT)', group: 'Teacher', payLevel: 'RPS 2022', startingBasic: null, responsibilities: 'Primary classes.', notes: '2026: 1,205 posts (plus 200 special education).' },
      { name: 'School Assistant (SA)', group: 'Teacher', payLevel: 'RPS 2022', startingBasic: null, responsibilities: 'High school subject teacher.', notes: '2026: 906 posts (plus 150 special education).' },
      { name: 'Trained Graduate Teacher (TGT)', group: 'Teacher', payLevel: 'RPS 2022', startingBasic: null, responsibilities: 'Residential and society schools.', notes: '2026: 113 posts.' },
      { name: 'Post Graduate Teacher (PGT)', group: 'Teacher', payLevel: 'RPS 2022', startingBasic: null, responsibilities: 'Senior classes in residential schools.', notes: '2026: 81 posts.' },
      { name: 'Principal', group: 'Teacher', payLevel: 'RPS 2022', startingBasic: null, responsibilities: 'Heads a residential school.', notes: '2026: 30 posts.' },
      { name: 'Physical Education Teacher / Physical Director', group: 'Teacher', payLevel: 'RPS 2022', startingBasic: null, responsibilities: 'Physical education.', notes: '2026: 34 PET and 2 PD posts.' }],
    eligibility: {
      age: { summary: 'Set in the detailed notification (due by 3 November 2026).', referenceDate: 'As per detailed notification', relaxations: apRelax },
      nationality: 'Citizen of India.', domicile: 'District-level local cadre rules apply for most teacher posts.',
      education: { summary: 'SGT: Intermediate with a D.El.Ed (or equivalent). School Assistant / TGT: a degree in the subject with B.Ed. PGT: a postgraduate degree with B.Ed. AP TET qualification is required for SGT and SA posts, as per NCTE norms. Exact conditions are in the detailed notification.', finalYearAllowed: false, minMarks: 'As per NCTE norms in the notification' },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      examVsPost: 'Each post type has its own qualification; vacancies are district-wise.',
      reservation: apReservation,
    },
    eligibilityRules: { ageMin: 18, ageMax: 44, minEducation: 'class-12', educationFields: ['education'], relaxationYears: relaxYears, domicile: 'andhra-pradesh', notes: 'Age limit to be confirmed in the detailed notification (44 is the envelope used for AP recruitment in 2026). Needs D.El.Ed or B.Ed and TET.' },
    selection: { stages: [{ name: 'Teacher Recruitment Test (computer-based, objective)', type: 'objective', countsInMerit: true, notes: 'Objective CBT. Reports say merit is 80% TRT and 20% AP TET score; confirm in the detailed notification.' }, { name: 'Certificate verification', type: 'document', countsInMerit: false }],
      meritCalculation: 'TRT marks combined with AP TET weightage (reported 80:20).', languages: 'Telugu, English and minority languages as per post.', documentVerification: 'District level.', probation: 'As per AP rules.' },
    syllabus: { officialLink: 'https://tet2dsc.apcfss.in', sections: [{ stage: 'TRT', subject: 'Typical areas', topics: ['General knowledge and current affairs', 'Perspectives in education, classroom implementation', 'Child development and pedagogy', 'Subject content and methodology for the post'] }] },
    syllabusTags: ['teaching-pedagogy', 'teaching-subject', 'current-affairs', 'telugu-language', 'english-language'],
    statistics: [{ year: 2026, vacancies: 2721, note: 'Tentative: 2,111 regular schools, 350 special education, 260 other education societies.', source: 's1' }],
    salary: { payRuleSet: 'ap-rps-2022', payLevel: 'AP RPS 2022', payScale: 'By post', startingBasic: null, pension: 'Contributory Pension Scheme.', increments: 'Annual increment.', notes: 'Teacher pay scales by post are in the detailed notification.' },
    career: { progression: [{ post: 'SGT', level: 'RPS 2022', timeline: 'Entry', timelineType: 'official' }, { post: 'School Assistant', level: 'Higher scale', timeline: 'By promotion', timelineType: 'typical' }, { post: 'Headmaster / MEO', level: 'Higher scale', timeline: 'Senior', timelineType: 'typical' }], promotionNotes: 'Promotions by seniority and qualifications.', sources: ['s1'] },
    workLife: { postings: 'Schools within the district, often rural.', transfers: 'Under the teacher transfer policy.', nature: 'Teaching.', workload: 'Moderate.', publicInteraction: 'High (students, parents).', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Large pool of TET-qualified candidates for a few thousand district-wise posts.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'high', recruitmentRegularity: 'low', rationale: 'Posted in your own district; DSC is irregular.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'DSC comes every few years.' }, { factor: 'Litigation', level: 'medium', note: 'Past DSCs saw court cases over rosters.' }] },
    sources: [['s1', 'AP DSC 2026 notification out: 2,721 tentative teacher vacancies', 'https://news.careers360.com/ap-dsc-2026-notification-out-at-cse-ap-gov-in-andhra-pradesh-announces-2721-tentative-teacher-vacancies/amp', 'Careers360 (reports the official notification)', 2026, 'secondary']],
    dataQuality: { confidence: 'low', gaps: ['The preliminary notice did not give age, pay scales, exam pattern or weightage; check the detailed notification.'], notes: 'Post counts from a report of the preliminary notification.' },
  },
  appscPost({ id: 'appsc-hwo', name: 'APPSC Hostel Welfare Officer Grade-II', abbreviation: 'APPSC HWO', sector: 'teaching', department: 'AP Social Welfare, Tribal Welfare and Backward Classes Welfare departments', summary: 'District-wide posts managing government welfare hostels for SC, ST and BC students. Needs a degree with B.Ed. One written exam.', number: '25/2026', notified: '2026-10-09', applyFrom: '2026-10-09', applyTo: '2026-10-29', file: 'HWO_252026.pdf', post: 'Hostel Welfare Officer Grade-II', vacancies: 97, ageMin: 18, ageMax: 44, scale: '37,640-1,15,500', startingBasic: 37640, education: 'Graduation with B.Ed. or B.T. (or equivalent), as per notification.', educationRules: { level: 'graduate', fields: ['education'] }, paperTwo: { name: 'Education (B.Ed. standard) as per notification', marks: 150 }, tags: ['teaching-pedagogy'], nature: 'Runs welfare hostels: student welfare, food, discipline, records.', cadre: 'District post' }),
  appscPost({ id: 'appsc-amvi', name: 'APPSC Assistant Motor Vehicle Inspector', abbreviation: 'APPSC AMVI', sector: 'transport', department: 'AP Transport Department', summary: 'Assistant Motor Vehicle Inspector in the AP Transport Department: vehicle fitness checks, licensing tests and enforcement. Needs a mechanical or automobile degree or diploma. Two-paper objective exam (450 marks).', number: '36/2026', notified: '2026-10-13', applyFrom: '2026-11-06', applyTo: '2026-11-26', file: 'AMVI_362026.pdf', post: 'Assistant Motor Vehicle Inspector', vacancies: 50, ageMin: 21, ageMax: 36, scale: '48,440-1,37,220', startingBasic: 48440, education: 'A degree in Mechanical or Automobile Engineering, or a diploma in Automobile or Mechanical Engineering with conditions, as per notification.', educationRules: { level: 'diploma', fields: ['engineering-mechanical'] }, technical: true, paperTwo: { name: 'Automobile Engineering (diploma standard)', marks: 300 }, tags: ['engineering-mechanical'], nature: 'Vehicle inspection, driving tests, road safety enforcement.', cadre: 'Zonal post' }),
  appscPost({ id: 'appsc-aso-statistics', name: 'APPSC Assistant Statistical Officer', abbreviation: 'APPSC ASO (Statistics)', sector: 'revenue-clerical', department: 'AP Economics and Statistics Department', summary: 'Statistical posts in the AP Directorate of Economics and Statistics: surveys, crop estimates and data work. Needs a degree with statistics. Two-paper objective exam.', number: '20/2026', notified: '2026-09-15', applyFrom: '2026-10-13', applyTo: '2026-11-02', file: 'Assistant_Statistical_Officer_202026.pdf', post: 'Assistant Statistical Officer', vacancies: 196, ageMin: 18, ageMax: 44, scale: '37,640-1,15,500', startingBasic: 37640, education: 'A bachelor\'s degree with Statistics as a main subject, or with Mathematics, Economics or Commerce including Statistics as a paper, as listed in the notification.', educationRules: { level: 'graduate', fields: ['statistics', 'mathematics', 'economics', 'commerce'] }, paperTwo: { name: 'Statistics (subject paper)', marks: 150 }, tags: ['statistics'], nature: 'Field surveys and statistical compilation.', cadre: 'District post' }),
  appscPost({ id: 'appsc-horticulture-officer', name: 'APPSC Horticulture Officer', abbreviation: 'APPSC HO', sector: 'other', department: 'AP Horticulture Department', summary: 'Gazetted Horticulture Officer posts in Andhra Pradesh, for four-year B.Sc. Horticulture graduates. Two-paper objective exam.', number: '19/2026', notified: '2026-10-06', applyFrom: '2026-10-06', applyTo: '2026-10-27', file: 'Horticulture_19_2026.pdf', post: 'Horticulture Officer', vacancies: 37, ageMin: 18, ageMax: 44, scale: '54,060-1,40,540', startingBasic: 54060, education: 'A four-year B.Sc. or B.Sc. (Hons) degree in Horticulture from a recognised university.', educationRules: { level: 'graduate', fields: ['agriculture'] }, technical: true, paperTwo: { name: 'Horticulture (degree standard)', marks: 300 }, tags: ['agriculture'], nature: 'Extension and schemes for horticulture farmers.', cadre: 'Zonal post' }),
]
