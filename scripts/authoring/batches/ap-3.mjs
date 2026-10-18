/**
 * Batch: AP DSC / APTRT 2026 (preliminary notification, secondary report).
 */
const apSchool = { id: 'ap-school-education', name: 'Department of School Education, Andhra Pradesh', abbreviation: 'AP School Education', website: 'https://cse.ap.gov.in' }
const apRelax = [{ category: 'SC, ST, BC and EWS', years: 5 }, { category: 'PwBD', years: 10 }, { category: 'AP State Government employees', years: 5, note: 'Based on service.' }]
const relaxYears = { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }
const apReservation = 'AP rules: SC 15% (sub-categorised as per 2025 orders), ST 6%, BC 29% (A 7, B 10, C 1, D 7, E 4), EWS 10%, horizontal reservation for women (33 1/3%), PwBD, ex-servicemen; local cadre rules for zonal and district posts.'
const minMarks = 'Minimum to qualify: OC, EWS, sportspersons 40%; BC 35%; SC, ST, PwBD 30%.'
const irregular = { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'These posts are notified every few years.' }] }
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
    dataQuality: { confidence: 'low', gaps: ['Detailed notification not yet released at research time: age, pay scales, exam pattern and weightage to be confirmed.'], notes: 'Post counts from a report of the preliminary notification.' },
  },
]
