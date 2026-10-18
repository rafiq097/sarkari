/**
 * Batch: SSC CHSL, JE, Stenographer (2026 notices).
 * Facts taken from the official SSC notices listed in each spec's sources.
 */
const ssc = { id: 'ssc', name: 'Staff Selection Commission', abbreviation: 'SSC', website: 'https://ssc.gov.in' }
const noticeBase = 'https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards'
const commonRisk = (note) => ({ overall: 'medium', factors: [
  { factor: 'Long cycles', level: 'medium', note: 'Notice to joining often takes a year or more.' },
  { factor: 'Pattern changes', level: 'medium', note: 'SSC revises schemes from time to time; read each year\'s notice.' },
  { factor: 'Irregular recruitment', level: 'low', note },
] })

export default [
  {
    id: 'ssc-chsl', name: 'Combined Higher Secondary (10+2) Level Examination', abbreviation: 'SSC CHSL', jurisdiction: 'central', sector: 'ssc', organization: ssc,
    department: 'Central ministries, departments and offices',
    summary: 'Class 12 level recruitment for Lower Division Clerk / Junior Secretariat Assistant and Data Entry Operator posts across central government. Tier I screens; Tier II, with qualifying computer and typing or data-entry tests, decides merit.',
    recruitmentMethods: ['competitive-exam', 'skill-test', 'document-verification'], frequency: 'Annual (SSC calendar)',
    officialLinks: [{ label: 'CHSL 2026 notice', url: `${noticeBase}/Notice_of_adv_chsl_2026.pdf` }, { label: 'SSC website', url: 'https://ssc.gov.in' }],
    status: { type: 'active', note: 'Held every year. The 2026 cycle was notified in September 2026; Tier I and Tier II dates are announced later by SSC.', cycles: [{ cycle: 'CHSL 2026', events: [
      { event: 'Applications open', date: '2026-09-07', dateType: 'official', source: 's1' },
      { event: 'Last date to apply (11 PM)', date: '2026-10-07', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Lower Division Clerk / Junior Secretariat Assistant', group: 'Group C', payLevel: 'Level 2', startingBasic: 19900, responsibilities: 'Clerical work, typing, records in central offices.' },
      { name: 'Data Entry Operator', group: 'Group C', payLevel: 'Level 4 / Level 5', startingBasic: 25500, responsibilities: 'Data entry and computer operations.' },
      { name: 'Data Entry Operator Grade A', group: 'Group C', payLevel: 'Level 4', startingBasic: 25500, responsibilities: 'Data entry and computer operations.' },
    ],
    eligibility: {
      age: { summary: '18 to 27 years on 1 August of the exam year. For CHSL 2026: born between 2 August 1999 and 1 August 2008.', referenceDate: '1 August of the exam year' },
      nationality: 'Citizen of India, or other categories with an eligibility certificate, as per the notice.',
      education: { summary: 'Class 12 pass. For DEO / DEO Grade A in the Ministry of Consumer Affairs, Food and Public Distribution, the SSC and the Ministry of Culture: Class 12 in the Science stream with Mathematics.', finalYearAllowed: true, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit (within age limit)' }],
      other: ['Fee exemption for women, SC, ST, PwBD and ex-servicemen.'],
      examVsPost: 'Some DEO posts need Science with Maths in Class 12; LDC/JSA posts accept any stream.',
      disqualifications: ['Typing or skill test failure blocks selection for that post.'],
    },
    eligibilityRules: { ageMin: 18, ageMax: 27, ageReferenceDate: '2026-08-01', minEducation: 'class-12', finalYearAllowed: true },
    selection: {
      stages: [
        { name: 'Tier I (computer-based)', type: 'objective', countsInMerit: false, papers: [
          { name: 'English Language (basic knowledge)', marks: 50, questions: 25, duration: '15 min (sectional)', negative: '0.50 per wrong answer' },
          { name: 'General Intelligence', marks: 50, questions: 25, duration: '15 min', negative: '0.50' },
          { name: 'Quantitative Aptitude (basic arithmetic)', marks: 50, questions: 25, duration: '15 min', negative: '0.50' },
          { name: 'General Awareness', marks: 50, questions: 25, duration: '15 min', negative: '0.50' }], notes: '100 questions, 200 marks, 60 minutes. Screening.' },
        { name: 'Tier II (computer-based, same day)', type: 'objective', countsInMerit: true, papers: [
          { name: 'Section I: Mathematical Abilities (30 Q) + Reasoning (30 Q)', marks: 180, questions: 60, duration: '1 hour', negative: '1 mark per wrong answer' },
          { name: 'Section II: English (40 Q) + General Awareness (20 Q)', marks: 180, questions: 60, duration: '1 hour', negative: '1 mark' },
          { name: 'Section III: Computer Knowledge Test', marks: 45, questions: 15, duration: '15 min', qualifying: true, negative: '1 mark' },
          { name: 'Section IV: Skill / Typing Test', duration: '15 min', qualifying: true, notes: 'DEO (specified ministries): 15,000 key depressions per hour. Other DEO: 8,000 per hour. LDC/JSA: typing 35 wpm English or 30 wpm Hindi.' }],
          notes: 'Sessions I (2 hours 15 minutes) and II on the same day. Every section must be qualified.' },
        { name: 'Document verification', type: 'document', countsInMerit: false }],
      meritCalculation: 'Merit from Tier II Sections I and II (360 marks); Sections III and IV are qualifying.',
      normalization: 'Multi-shift scores are normalized as per SSC rules.', languages: 'English and Hindi (except English sections).', documentVerification: 'After Tier II.', probation: 'As per user department.',
    },
    syllabus: { officialLink: `${noticeBase}/Notice_of_adv_chsl_2026.pdf`, sections: [
      { stage: 'Tier I', subject: 'Four sections', topics: ['English: grammar, vocabulary, comprehension', 'General intelligence: verbal and non-verbal reasoning', 'Quantitative aptitude: arithmetic, algebra, geometry, mensuration, trigonometry, data interpretation (basic)', 'General awareness: current events, history, geography, polity, economy, science'] },
      { stage: 'Tier II', subject: 'Paper sections', topics: ['Mathematical abilities and reasoning', 'English language and comprehension, general awareness', 'Computer knowledge', 'Typing / data entry skill'] }] },
    syllabusTags: ['english-language', 'reasoning', 'quantitative-aptitude', 'general-awareness', 'current-affairs', 'computer-awareness', 'typing-skill'],
    statistics: [{ year: 2026, vacancies: 2536, selected: null, note: 'Tentative vacancies in the notice.', source: 's1' }],
    rankAndAllocation: { text: 'Posts are allotted on merit-cum-preference; skill test standards differ by post.' },
    salary: { payRuleSet: 'central-7cpc', payLevel: 'Level 2 (LDC/JSA) to Level 5 (DEO)', payScale: '19,900 to 92,300', startingBasic: 19900, pension: 'NPS with the UPS option.', increments: '3% a year; MACP at 10, 20 and 30 years.', notes: 'Starting basic shown is LDC/JSA (Level 2). DEO posts start at Level 4 (25,500).' },
    career: { progression: [
      { post: 'LDC / JSA', level: 'Level 2', timeline: 'Entry', timelineType: 'official' },
      { post: 'UDC / SSA', level: 'Level 4', timeline: 'By seniority or departmental exam', timelineType: 'typical' },
      { post: 'Assistant / ASO', level: 'Level 6 to 7', timeline: 'Mid career', timelineType: 'typical' }],
      promotionNotes: 'Depends on the cadre; many staff also take CGL later for a higher post.', macp: 'MACP at 10, 20 and 30 years if not promoted.' },
    workLife: { postings: 'Central offices across India.', transfers: 'Limited.', nature: 'Desk.', workload: 'Moderate.', publicInteraction: 'Low to moderate.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'low', competition: 'high', timePressure: 'high', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'School-level syllabus, but very large applicant numbers for about 2,000 to 5,000 posts, and speed decides Tier II.' },
    ratings: { careerGrowth: 'low', locationFlexibility: 'medium', recruitmentRegularity: 'high', rationale: 'Annual entry-level recruitment; growth is slow without further exams.' },
    risk: commonRisk('Held every year.'),
    sources: [['s1', 'Notice: Combined Higher Secondary (10+2) Level Examination, 2026', `${noticeBase}/Notice_of_adv_chsl_2026.pdf`, 'Staff Selection Commission', 2026]],
    dataQuality: { confidence: 'high', gaps: ['Tier I and Tier II dates not yet announced in the notice.', 'Official cutoffs and applicant counts not collected.'], notes: 'From the CHSL 2026 notice.' },
  },
  {
    id: 'ssc-je', name: 'Junior Engineer (Civil, Mechanical, Electrical) Examination', abbreviation: 'SSC JE', jurisdiction: 'central', sector: 'engineering-psu', technical: true, organization: ssc,
    department: 'BRO, CPWD, CWC, MES, DGQA, Farakka Barrage, NTRO and other central bodies; also Scientific Assistant in IMD',
    summary: 'Recruits Junior Engineers (Civil, Electrical, Mechanical and Telecom) for central organizations, and from 2026 also Scientific Assistants for the India Meteorological Department. Group B, Level 6. Diploma or degree holders in the relevant branch can apply.',
    recruitmentMethods: ['competitive-exam', 'document-verification', 'medical-exam'], frequency: 'Annual (SSC calendar)',
    officialLinks: [{ label: 'JE 2026 notice', url: `${noticeBase}/Notice_of_adv_je_2026.pdf` }],
    status: { type: 'active', note: 'Held every year. 2026 cycle: Paper I tentatively October/November 2026 and Paper II in December 2026.', cycles: [{ cycle: 'JE 2026', events: [
      { event: 'Applications open', date: '2026-09-02', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-09-22', dateType: 'official', source: 's1' },
      { event: 'Correction window', date: '2026-09-28', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Junior Engineer (Civil)', group: 'Group B', payLevel: 'Level 6', startingBasic: 35400, responsibilities: 'Site supervision, estimates and maintenance of civil works.' },
      { name: 'Junior Engineer (Electrical / Mechanical)', group: 'Group B', payLevel: 'Level 6', startingBasic: 35400, responsibilities: 'Electrical and mechanical works and maintenance.' },
      { name: 'Junior Engineer (Telecom)', group: 'Group B', payLevel: 'Level 6', startingBasic: 35400, responsibilities: 'Telecom engineering.' },
      { name: 'Scientific Assistant, India Meteorological Department', group: 'Group B', payLevel: 'Level 6', startingBasic: 35400, responsibilities: 'Weather observation and instruments.', notes: 'Choose Part D, E or F (stream) in the application.' }],
    eligibility: {
      age: { summary: 'Upper limit up to 30 years for most organizations and up to 32 for some (as listed post-wise in the notice).', referenceDate: 'As per notice' },
      nationality: 'Citizen of India, or other categories as per the notice.',
      education: { summary: 'Degree or three-year diploma in the relevant branch (Civil, Electrical, Mechanical, Telecom). Some organizations accept only degrees or require experience with a diploma; see the post table in the notice.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      examVsPost: 'Each organization lists its own qualification; a diploma is not accepted everywhere. You may be eligible for more than one post (for example JE Telecom and IMD Scientific Assistant).',
    },
    eligibilityRules: { ageMin: 18, ageMax: 32, minEducation: 'diploma', educationFields: ['engineering-civil', 'engineering-mechanical', 'engineering-electrical', 'engineering-electronics', 'physics'], notes: 'Most posts close at 30; some at 32. Qualifications are by organization.' },
    selection: {
      stages: [
        { name: 'Paper I (computer-based, qualifying)', type: 'objective', countsInMerit: false, papers: [
          { name: 'General Intelligence and Reasoning', marks: 50, questions: 50 },
          { name: 'General Awareness', marks: 50, questions: 50 },
          { name: 'Branch part (A Civil, B Electrical, C Mechanical, D to F IMD streams, G Telecom)', marks: 100, questions: 100 }], notes: '2 hours. Minus 0.25 per wrong answer. Separate shortlists for JE Civil, JE Electrical and Mechanical, IMD and JE Telecom.' },
        { name: 'Paper II (computer-based)', type: 'objective', countsInMerit: true, papers: [{ name: 'Branch subject', marks: 300, questions: 100, duration: '2 hours', negative: '1 mark per wrong answer' }] },
        { name: 'Document verification and medical', type: 'document', countsInMerit: false }],
      meritCalculation: 'Paper I is qualifying; merit is from Paper II.', languages: 'English and Hindi.', documentVerification: 'After Paper II.', probation: 'As per user organization.',
    },
    syllabus: { officialLink: `${noticeBase}/Notice_of_adv_je_2026.pdf`, sections: [
      { stage: 'Paper I and II', subject: 'Branch parts', topics: ['Part A: General Engineering (Civil and Structural)', 'Part B: General Engineering (Electrical)', 'Part C: General Engineering (Mechanical)', 'Parts D to F: IMD streams (including Physics)', 'Part G: Telecommunication'] },
      { stage: 'Paper I', subject: 'Common', topics: ['General intelligence and reasoning', 'General awareness'] }] },
    syllabusTags: ['reasoning', 'general-awareness', 'engineering-civil', 'engineering-electrical', 'engineering-mechanical', 'engineering-electronics', 'physics'],
    statistics: [{ year: 2026, vacancies: 1748, note: 'Tentative vacancies in the notice.', source: 's1' }],
    rankAndAllocation: { text: 'Allocation by merit and organization preference within your branch list.' },
    salary: { payRuleSet: 'central-7cpc', payLevel: 'Level 6', payScale: '35,400 to 1,12,400', startingBasic: 35400, pension: 'NPS with the UPS option.', increments: '3% a year; MACP.' },
    career: { progression: [
      { post: 'Junior Engineer', level: 'Level 6', timeline: 'Entry', timelineType: 'official' },
      { post: 'Assistant Engineer', level: 'Level 7 to 8', timeline: 'After qualifying service', timelineType: 'typical' },
      { post: 'Executive Engineer', level: 'Level 10 to 11', timeline: 'Senior, by promotion', timelineType: 'typical' }],
      promotionNotes: 'Depends on the organization (CPWD, MES, BRO and so on).', macp: 'MACP at 10, 20 and 30 years.' },
    workLife: { postings: 'Project sites and offices across India; BRO in border areas.', transfers: 'Periodic.', nature: 'Field and site work.', workload: 'Moderate to high.', publicInteraction: 'Moderate (contractors).', hazards: 'Site risks; remote postings in BRO.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'medium', technicalComplexity: 'high', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Diploma-level engineering with a 1-mark penalty in Paper II; competition is high for under 2,000 posts.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'high', rationale: 'Annual. Promotion to AE and EE depends on the organization.' },
    risk: commonRisk('Held every year.'),
    sources: [['s1', 'Notice: Junior Engineer Examination, 2026', `${noticeBase}/Notice_of_adv_je_2026.pdf`, 'Staff Selection Commission', 2026]],
    dataQuality: { confidence: 'high', gaps: ['Post-wise age and qualification table summarised; see notice.', 'Cutoffs not collected.'], notes: 'From the JE 2026 notice.' },
  },
  {
    id: 'ssc-stenographer', name: 'Stenographer Grade C and D Examination', abbreviation: 'SSC Steno', jurisdiction: 'central', sector: 'ssc', organization: ssc,
    department: 'Central ministries and offices',
    summary: 'Recruits Stenographers Grade C (Level 6) and Grade D (Level 4) for central offices. One computer-based exam, then a qualifying shorthand skill test: a 10-minute dictation at 100 wpm (Grade C) or 80 wpm (Grade D), transcribed on computer.',
    recruitmentMethods: ['competitive-exam', 'skill-test', 'document-verification'], frequency: 'Annual (SSC calendar)',
    officialLinks: [{ label: 'Stenographer 2026 notice', url: `${noticeBase}/Notice_of_adv_steno_2026.pdf` }],
    status: { type: 'active', note: 'Held every year; usually notified in spring with the exam a few months later.', cycles: [{ cycle: 'Stenographer 2026', events: [
      { event: 'Applications open', date: '2026-04-24', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-05-15', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Stenographer Grade C', group: 'Group B', payLevel: 'Level 6', startingBasic: 35400, ageMax: 30, responsibilities: 'Shorthand, transcription and secretarial support to senior officers.' },
      { name: 'Stenographer Grade D', group: 'Group C', payLevel: 'Level 4', startingBasic: 25500, ageMax: 27, responsibilities: 'Shorthand and office support.' }],
    eligibility: {
      age: { summary: 'Grade C: 18 to 30 (born 2 Aug 1996 to 1 Aug 2008 for 2026). Grade D: 18 to 27 (born 2 Aug 1999 to 1 Aug 2008). On 1 August of the exam year.', referenceDate: '1 August of the exam year' },
      nationality: 'As per notice.',
      education: { summary: 'Class 12 pass.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      examVsPost: 'One exam for both grades; the skill test speed differs by grade.',
    },
    eligibilityRules: { ageMin: 18, ageMax: 30, ageReferenceDate: '2026-08-01', minEducation: 'class-12', notes: 'Grade D closes at 27. Shorthand skill required.' },
    selection: {
      stages: [
        { name: 'Computer-based exam', type: 'objective', countsInMerit: true, papers: [
          { name: 'General Intelligence and Reasoning', marks: 50, questions: 50 },
          { name: 'General Awareness', marks: 50, questions: 50 },
          { name: 'English Language and Comprehension', marks: 100, questions: 100 }], notes: '200 questions, 200 marks, 2 hours. Minus 0.25 per wrong answer.' },
        { name: 'Skill Test in Stenography', type: 'skill', countsInMerit: false, notes: '10-minute dictation in English or Hindi: 100 wpm (Grade C) or 80 wpm (Grade D). Transcription on computer: Grade D English 50 minutes (70 with scribe); other limits as per notice. Qualifying, with category-wise standards.' }],
      meritCalculation: 'Merit from the computer-based exam among candidates who qualify the skill test.', languages: 'English and Hindi.', documentVerification: 'After the skill test.', probation: 'As per user department.',
    },
    syllabus: { officialLink: `${noticeBase}/Notice_of_adv_steno_2026.pdf`, sections: [{ stage: 'CBE', subject: 'Three parts', topics: ['General intelligence and reasoning', 'General awareness', 'English language and comprehension (grammar, vocabulary, comprehension)'] }] },
    syllabusTags: ['reasoning', 'general-awareness', 'english-language', 'stenography-skill'],
    statistics: [{ year: 2026, vacancies: 731, note: 'Approximate vacancies in the notice.', source: 's1' }],
    salary: { payRuleSet: 'central-7cpc', payLevel: 'Level 6 (Grade C) / Level 4 (Grade D)', payScale: '35,400 / 25,500 first cell', startingBasic: 35400, pension: 'NPS with the UPS option.', increments: '3% a year; MACP.', notes: 'Grade D starts at Level 4 (25,500).' },
    career: { progression: [
      { post: 'Stenographer Grade D', level: 'Level 4', timeline: 'Entry', timelineType: 'official' },
      { post: 'Stenographer Grade C / Personal Assistant', level: 'Level 6 to 7', timeline: 'By promotion', timelineType: 'typical' },
      { post: 'Private Secretary / Principal Private Secretary', level: 'Level 10 to 11', timeline: 'Senior', timelineType: 'typical' }],
      promotionNotes: 'Central Secretariat Stenographers Service has a defined ladder; other offices vary.', macp: 'MACP at 10, 20 and 30 years.' },
    workLife: { postings: 'Mostly Delhi for ministries; field offices elsewhere.', transfers: 'Limited.', nature: 'Desk, attached to officers.', workload: 'Moderate; follows the officer\'s schedule.', publicInteraction: 'Low.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'low', competition: 'medium', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Simple written syllabus; the shorthand speed test is the real filter.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'low', recruitmentRegularity: 'high', rationale: 'Annual; clear stenographer ladder in the Secretariat.' },
    risk: commonRisk('Held every year.'),
    sources: [['s1', 'Notice: Stenographer Grade C and D Examination, 2026', `${noticeBase}/Notice_of_adv_steno_2026.pdf`, 'Staff Selection Commission', 2026]],
    dataQuality: { confidence: 'high', gaps: ['Exam date after the notice not confirmed.', 'All transcription time limits not reproduced.'], notes: 'From the 2026 notice.' },
  },
]
