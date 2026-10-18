/**
 * Batch: AP power utilities Assistant Executive Engineer recruitment 2026 (APTRANSCO,
 * APGENCO, APSPDCL, APCPDCL, APEPDCL), from a report of the notifications.
 */
const apPower = { id: 'ap-power-utilities', name: 'AP power utilities (APTRANSCO, APGENCO, APSPDCL, APCPDCL, APEPDCL)', abbreviation: 'AP Vidyut', website: 'https://www.aptransco.co.in' }

export default [
  {
    id: 'ap-power-aee', name: 'AP Power Utilities Assistant Executive Engineer Recruitment', abbreviation: 'AP Vidyut AEE', jurisdiction: 'andhra-pradesh', sector: 'power-utilities', technical: true, organization: apPower,
    department: 'Energy Department, Andhra Pradesh (state power companies)', summary: 'Combined recruitment of Assistant Executive Engineers for Andhra Pradesh\'s transmission, generation and distribution companies, mostly in electrical engineering. One computer-based test.',
    recruitmentMethods: ['competitive-exam', 'document-verification'], frequency: 'Irregular',
    officialLinks: [{ label: 'APTRANSCO', url: 'https://www.aptransco.co.in' }],
    status: { type: 'active', note: '2026 cycle: 630 AEE posts announced on 24 June 2026; applications 30 June to 20 July 2026; APTRANSCO CBT 22 to 29 August 2026.', cycles: [{ cycle: 'AEE 2026', events: [
      { event: 'Notification announced', date: '2026-06-24', dateType: 'official', source: 's1' },
      { event: 'Applications open', date: '2026-06-30', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-07-20', dateType: 'official', source: 's1' },
      { event: 'APTRANSCO computer-based test begins', date: '2026-08-22', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'AEE, APTRANSCO (Electrical 167, Civil 23, Telecom 10)', group: 'Engineer', payLevel: 'Utility scale', startingBasic: null, responsibilities: 'Transmission lines and substations.', notes: '200 posts.' },
      { name: 'AEE, APGENCO (Electrical/Mechanical/Electronics 80, Civil 20)', group: 'Engineer', payLevel: 'Utility scale', startingBasic: null, responsibilities: 'Power plants.', notes: '100 posts.' },
      { name: 'AEE, APSPDCL (Electrical 125, Civil 6, Telecom 4)', group: 'Engineer', payLevel: 'Utility scale', startingBasic: null, responsibilities: 'Distribution in southern districts.', notes: '135 posts.' },
      { name: 'AEE, APEPDCL (Electrical 128, Civil 4, Telecom 3)', group: 'Engineer', payLevel: 'Utility scale', startingBasic: null, responsibilities: 'Distribution in eastern districts.', notes: '135 posts.' },
      { name: 'AEE, APCPDCL (Electrical 56, Civil 3, Telecom 1)', group: 'Engineer', payLevel: 'Utility scale', startingBasic: null, responsibilities: 'Distribution in central districts.', notes: '60 posts.' }],
    eligibility: {
      age: { summary: 'As per the notifications (not confirmed here).', referenceDate: 'As per notification', relaxations: [{ category: 'SC, ST, BC and EWS', years: 5 }] },
      nationality: 'Citizen of India.', domicile: 'AP local cadre rules apply.',
      education: { summary: 'A degree in the relevant engineering branch (electrical, civil, mechanical, electronics or telecom).', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
    },
    eligibilityRules: { ageMin: 18, ageMax: null, minEducation: 'graduate', educationFields: ['engineering-electrical', 'engineering-civil', 'engineering-mechanical', 'engineering-electronics'], relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }, domicile: 'andhra-pradesh', notes: 'Age limit not confirmed.' },
    selection: { stages: [{ name: 'Computer-based test', type: 'objective', countsInMerit: true }, { name: 'Certificate verification', type: 'document', countsInMerit: false }], meritCalculation: 'Merit on the CBT.', languages: 'English.', probation: 'As per company rules.' },
    syllabus: { officialLink: null, sections: [{ stage: 'CBT', subject: 'Typical areas', topics: ['Core subject of the branch (degree level)', 'General awareness and aptitude'] }] },
    syllabusTags: ['engineering-electrical', 'engineering-civil', 'engineering-mechanical', 'engineering-electronics', 'reasoning', 'general-awareness'],
    statistics: [{ year: 2026, vacancies: 630, note: 'Across five companies.', source: 's1' }],
    salary: { payRuleSet: 'other', payLevel: 'Power utility scales', payScale: null, startingBasic: null, notes: 'AP power companies have their own pay scales, revised separately from government PRCs; not confirmed here.' },
    career: { progression: [{ post: 'Assistant Executive Engineer', level: 'Utility scale', timeline: 'Entry', timelineType: 'official' }, { post: 'Assistant Divisional Engineer, Divisional Engineer', level: 'Higher scales', timeline: 'By promotion', timelineType: 'typical' }], sources: ['s1'] },
    workLife: { postings: 'Substations, plants and division offices across AP.', transfers: 'Periodic.', nature: 'Field engineering, shifts at plants.', workload: 'High during outages and peak season.', publicInteraction: 'Moderate (distribution).', hazards: 'Electrical safety risks.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'medium', timePressure: 'medium', technicalComplexity: 'high', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Branch-focused exam with a large number of posts in 2026.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Good engineering posts; recruitment is occasional.' },
    risk: { overall: 'medium', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'Large cycles are rare.' }] },
    sources: [['s1', 'AP Power Sector Recruitment 2026: 630 AEE posts', 'https://testbook.com/news/aptransco-andhra-pradesh-power-sector-notification-2026-out/', 'Testbook (reports the notifications)', 2026, 'secondary']],
    dataQuality: { confidence: 'low', gaps: ['Official notifications not read: age, pay scales and exam pattern not confirmed.'], notes: 'Post counts and dates from a secondary report.' },
  },
]
