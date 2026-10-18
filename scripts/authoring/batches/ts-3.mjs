/**
 * Batch: TG DSC / TRT (last cycle 2024). Recurring route; figures from news reports
 * (secondary), with conflicting or unverified values left empty. Telangana Police moved to ts-4.mjs.
 */
const tsSchool = { id: 'ts-school-education', name: 'Department of School Education, Telangana', abbreviation: 'TG School Education', website: 'https://schooledu.telangana.gov.in' }
const tsRelax = [{ category: 'SC, ST, BC and EWS', years: 5 }, { category: 'Others', years: null, note: 'As per notification.' }]

export default [
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

