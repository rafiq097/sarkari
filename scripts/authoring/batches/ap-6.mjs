/**
 * Batch: APPSC lecturer recruitments: polytechnic (13/2023), junior college (16/2023),
 * degree college (17/2023), TTD colleges, and the 2026 DIET / SCERT lecturers (30/2026).
 * Pattern, age and polytechnic pay from the official 13/2023 notification; the rest secondary.
 */
const appsc = { id: 'appsc', name: 'Andhra Pradesh Public Service Commission', abbreviation: 'APPSC', website: 'https://psc.ap.gov.in' }
const polytechnicNotice = 'https://images.tv9telugu.com/wp-content/uploads/2023/12/appsc-lecturers.pdf'
const examSchedule = 'https://images.tv9telugu.com/wp-content/uploads/2025/04/appsc.pdf'

export default [
  {
    id: 'appsc-lecturers', name: 'APPSC Lecturers (Polytechnic, Junior College, Degree College, DIET)', abbreviation: 'APPSC Lecturers', jurisdiction: 'andhra-pradesh', sector: 'teaching', organization: appsc,
    department: 'AP Technical, Intermediate, Collegiate and School Education departments; TTD colleges', summary: 'APPSC recruitment of lecturers for government polytechnics, junior colleges, degree colleges and teacher-training institutes (DIET, SCERT). Two objective papers: general studies (150) and your subject (300). A new 2026 notice has 160 DIET and SCERT posts.',
    recruitmentMethods: ['competitive-exam', 'skill-test', 'document-verification'], frequency: 'Irregular',
    officialLinks: [{ label: 'APPSC notifications', url: 'https://portal-psc.ap.gov.in/HomePages/RecruitmentNotifications.aspx' }],
    status: { type: 'active', note: 'The 2023 notifications (polytechnic 99, junior college 47 and degree college posts) held computer-based tests from 16 to 26 June 2025, with junior lecturer results in February 2026 and degree college selections in July 2026. Brief Notification 30/2026 (13 Oct 2026) adds 160 DIET and SCERT lecturer posts.', cycles: [
      { cycle: 'Lecturers 2023 (13, 16, 17/2023)', events: [
        { event: 'Computer-based tests begin', date: '2025-06-16', dateType: 'official', source: 's2' },
        { event: 'Junior lecturer results', date: '2026-02-13', dateType: 'official', source: 's3' }] },
      { cycle: 'DIET and SCERT lecturers (30/2026)', events: [
        { event: 'Brief notification', date: '2026-10-13', dateType: 'official', source: 's4' },
        { event: 'Applications open', date: '2026-11-18', dateType: 'official', source: 's4' },
        { event: 'Last date to apply', date: '2026-12-08', dateType: 'official', source: 's4' }] }] },
    posts: [
      { name: 'Lecturer, Government Polytechnic Colleges (engineering and non-engineering)', group: 'AP Technical Education Service', payLevel: 'AICTE 2016 scale', startingBasic: 56100, ageMin: 18, ageMax: 42, responsibilities: 'Teaches diploma students.', notes: '13/2023: 99 posts. Scale 56,100 to 98,400 (AICTE 2016).' },
      { name: 'Junior Lecturer, Government Junior Colleges', group: 'AP Intermediate Education Service', payLevel: 'AP RPS 2022', startingBasic: null, responsibilities: 'Teaches intermediate (Class 11 and 12) students.', notes: '16/2023: 47 posts.' },
      { name: 'Lecturer, Government Degree Colleges', group: 'AP Collegiate Education Service', payLevel: 'As per notification', startingBasic: null, responsibilities: 'Teaches undergraduate students.', notes: '17/2023.' },
      { name: 'Lecturer and Junior Lecturer, TTD colleges', group: 'TTD', payLevel: 'AP RPS 2022', startingBasic: 57100, responsibilities: 'Teaches in Tirumala Tirupati Devasthanams colleges.', notes: 'TTD 16/2023: 49 degree / oriental college lecturers (61,960 to 1,51,370) and 29 junior lecturers (57,100 to 1,47,760).' },
      { name: 'Senior Lecturer and Lecturer, DIET; Lecturer, SCERT', group: 'AP School Education Service', payLevel: 'As per notification', startingBasic: null, ageMin: 18, ageMax: 44, responsibilities: 'Trains teachers in district and state institutes.', notes: '30/2026: 46 Senior Lecturer DIET, 104 Lecturer DIET, 10 Lecturer SCERT. Age 18 to 44 on 1 July 2026.' }],
    eligibility: {
      age: { summary: '18 to 42 for the 2023 polytechnic notice (on 1 July 2023); 18 to 44 for the 2026 DIET and SCERT notice (on 1 July 2026).', referenceDate: '1 July of the notification year', relaxations: [{ category: 'SC, ST, BC and AP State Government employees', years: 5 }, { category: 'PwBD', years: 10 }, { category: 'NCC, ex-servicemen, retrenched employees', years: 3 }] },
      nationality: 'Citizen of India.', domicile: 'AP local-cadre rules apply.',
      education: { summary: 'A postgraduate degree in the subject (engineering degree for engineering polytechnic posts), usually first class or 50 to 55% as set per post. Degree college posts follow UGC norms (NET or PhD). DIET qualifications are in the detailed 2026 notice.', finalYearAllowed: false, minMarks: 'Set per post in each notification' },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
    },
    eligibilityRules: { ageMin: 18, ageMax: 44, minEducation: 'postgraduate', relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }, domicile: 'andhra-pradesh', notes: 'Engineering polytechnic posts accept a BE/BTech in the branch.' },
    selection: { stages: [
      { name: 'Computer-based test (objective)', type: 'objective', countsInMerit: true, papers: [
        { name: 'Paper 1: General Studies and Mental Ability (degree standard)', marks: 150, questions: 150, duration: '150 minutes', negative: 'One third of the question\'s marks' },
        { name: 'Paper 2: Concerned subject', marks: 300, questions: 150, duration: '150 minutes', negative: 'One third of the question\'s marks' }] },
      { name: 'Computer Proficiency Test (qualifying)', type: 'skill', countsInMerit: false },
      { name: 'Certificate verification', type: 'document', countsInMerit: false }],
      meritCalculation: 'Merit on the 450 marks of the two papers. The 2026 DIET notice uses a single computer-based test with no screening.', languages: 'English (general studies also in Telugu).', documentVerification: 'After results.', probation: 'As per AP service rules.' },
    syllabus: { officialLink: polytechnicNotice, sections: [{ stage: 'CBT', subject: 'Two papers', topics: ['General studies and mental ability (degree standard)', 'Concerned subject at postgraduate (or engineering degree) level'] }] },
    syllabusTags: ['general-awareness', 'current-affairs', 'ap-history-culture', 'reasoning', 'teaching-subject'],
    statistics: [{ year: 2023, vacancies: 99, note: 'Polytechnic lecturers, 13/2023 (official).', source: 's1' }, { year: 2026, vacancies: 160, note: 'DIET and SCERT lecturers, 30/2026.', source: 's4' }],
    salary: { payRuleSet: 'ap-rps-2022', payLevel: 'AP RPS 2022 or AICTE scale (by post)', payScale: 'Polytechnic 56,100 to 98,400 (AICTE 2016); TTD junior lecturer 57,100 to 1,47,760', startingBasic: 56100, pension: 'Contributory Pension Scheme.', notes: 'Starting basic shown is the polytechnic lecturer (AICTE scale).' },
    career: { progression: [{ post: 'Lecturer', level: 'Entry scale', timeline: 'Entry', timelineType: 'official' }, { post: 'Senior Lecturer / Head of Section / Principal', level: 'Higher scales', timeline: 'By promotion', timelineType: 'typical' }], promotionNotes: 'Promotions within each education service.', sources: ['s1'] },
    benefits: [{ item: 'State government benefits', detail: 'HRA, EHS health scheme and leave as per AP rules.', conditional: false, sources: ['s1'] }],
    workLife: { postings: 'Government colleges and institutes across Andhra Pradesh.', transfers: 'Within the service.', nature: 'Teaching.', workload: 'Moderate.', publicInteraction: 'High.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'high', competition: 'high', timePressure: 'medium', technicalComplexity: 'medium', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Few posts per subject; the 300-mark subject paper decides rank.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Good academic jobs, but notices are rare and small.' },
    risk: { overall: 'medium', factors: [{ factor: 'Slow cycles', level: 'high', note: 'The 2023 notices took until 2025 to hold exams.' }] },
    sources: [
      ['s1', 'APPSC Notification 13/2023: Lecturers in Government Polytechnic Colleges', polytechnicNotice, 'Andhra Pradesh Public Service Commission', 2023],
      ['s2', 'APPSC web note: schedule of CBTs for 13/2023, 16/2023, 17/2023 and TTD 16/2023', examSchedule, 'Andhra Pradesh Public Service Commission', 2025],
      ['s3', 'APPSC lecturer result 2026', 'https://www.careerpower.in/blog/appsc-lecturer-result-2026', 'Career Power', 2026, 'secondary'],
      ['s4', 'APPSC lecturer recruitment 2026 out for 160 posts', 'https://articles.findmycollege.com/news/appsc-lecturer-recruitment-2026-out-for-160-posts-apply-from-18-november/', 'FindMyCollege (reports the official brief notice)', 2026, 'secondary']],
    dataQuality: { confidence: 'medium', gaps: ['Degree college lecturer vacancies (17/2023) and pay not confirmed.', 'DIET pay and qualifications await the detailed 2026 notification.'], notes: 'Pattern, age and polytechnic pay from the official 13/2023 notification.' },
  },
]
