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
    status: { type: 'recurring', note: 'DSC is notified every few years. DSC-2024 (11,062 posts) took applications from 4 March to 2 April 2024, held the exam from 18 July to 5 August 2024 and published results on 30 September 2024.', cycles: [{ cycle: 'DSC-2024', events: [{ event: 'Applications open', date: '2024-03-04', dateType: 'official', source: 's2' }, { event: 'Last date to apply', date: '2024-04-02', dateType: 'official', source: 's2' }, { event: 'Exam begins', date: '2024-07-18', dateType: 'official', source: 's1' }, { event: 'Results', date: '2024-09-30', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'School Assistant', group: 'Teacher', payLevel: 'TS RPS 2020', startingBasic: null, responsibilities: 'High school subject teacher.' },
      { name: 'Secondary Grade Teacher', group: 'Teacher', payLevel: 'TS RPS 2020', startingBasic: null, responsibilities: 'Primary classes.' },
      { name: 'Language Pandit and Physical Education Teacher', group: 'Teacher', payLevel: 'TS RPS 2020', startingBasic: null, responsibilities: 'Languages and physical education.' }],
    eligibility: {
      age: { summary: '18 to 46 years, reckoned on 1 July of the year before the notice (1 July 2023 for DSC-2024).', referenceDate: '1 July (as per notice)', relaxations: tsRelax },
      nationality: 'Citizen of India.', domicile: 'District cadre with local reservation.',
      education: { summary: 'SGT: Intermediate with D.El.Ed. School Assistant: degree in the subject with B.Ed. TG TET (or CTET where allowed) is required for SGT and SA posts, as per NCTE norms.', finalYearAllowed: false, minMarks: 'As per NCTE norms' },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      examVsPost: 'TET is a separate qualifying test; its score carries 20% weightage in the TRT merit.',
    },
    eligibilityRules: { ageMin: 18, ageMax: 46, minEducation: 'class-12', educationFields: ['education'], relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }, domicile: 'telangana', notes: 'Needs D.El.Ed or B.Ed and TG TET.' },
    selection: { stages: [{ name: 'Teacher Recruitment Test (computer-based)', type: 'objective', countsInMerit: true }, { name: 'Certificate verification', type: 'document', countsInMerit: false }],
      meritCalculation: 'TRT marks with 20% weightage for the TET score, as stated in the TG TET notification.', languages: 'Telugu, English, Urdu and others as per post.', probation: 'As per rules.' },
    syllabus: { officialLink: null, sections: [{ stage: 'TRT', subject: 'Typical areas', topics: ['General knowledge and current affairs', 'Perspectives in education', 'Child development and pedagogy', 'Subject content and methodology'] }] },
    syllabusTags: ['teaching-pedagogy', 'teaching-subject', 'current-affairs', 'telugu-language', 'english-language'],
    statistics: [{ year: 2024, vacancies: 11062, note: 'DSC-2024: School Assistants, SGTs, Language Pandits, PETs and special education teachers.', source: 's2' }],
    salary: { payRuleSet: 'ts-rps-2020', payLevel: 'TS RPS 2020', payScale: null, startingBasic: null, pension: 'Contributory Pension Scheme.', notes: 'Teacher scales by post are in the notification.' },
    career: { progression: [{ post: 'SGT', level: 'RPS 2020', timeline: 'Entry', timelineType: 'official' }, { post: 'School Assistant, Headmaster', level: 'Higher scales', timeline: 'By promotion', timelineType: 'typical' }], sources: ['s1'] },
    workLife: { postings: 'Schools in your district, often rural.', transfers: 'Under the transfer policy.', nature: 'Teaching.', workload: 'Moderate.', publicInteraction: 'High.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Many TET-qualified candidates compete for district-wise posts.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'high', recruitmentRegularity: 'low', rationale: 'District posting; DSC is irregular.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'Years between DSCs.' }] },
    sources: [['s1', 'TSPSC TRT / TG DSC overview and vacancies', 'https://teachersbadi.in/tspsc-trt/', 'Teachersbadi', 2024, 'secondary'], ['s2', 'Telangana DSC-2024 notification (copy of the official notice)', 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/46a08b05-ff7a-415c-951e-199bc5dc7c29.pdf', 'Department of School Education, Telangana', 2024]],
    dataQuality: { confidence: 'medium', gaps: ['Pay scales by post and exam pattern not reproduced.'], notes: 'Posts, age and application dates from the official DSC-2024 notice.' },
  },
]

