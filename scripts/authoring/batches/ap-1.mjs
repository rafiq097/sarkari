/**
 * Batch: APPSC Group-I (Notification 07/2026) and Group-II (Brief Notification 37/2026).
 * Facts from the official APPSC notifications.
 */
const appsc = { id: 'appsc', name: 'Andhra Pradesh Public Service Commission', abbreviation: 'APPSC', website: 'https://psc.ap.gov.in' }
const docs = 'https://psc.ap.gov.in/Documents/NotificationDocuments'
const apReservation = 'Andhra Pradesh rules: SC 15% (sub-categorised into groups as per the 2025 orders, applied as stated in the notification), ST 6%, BC 29% (A 7%, B 10%, C 1%, D 7%, E 4%), EWS 10%. Horizontal reservation for women (33 1/3%), PwBD, ex-servicemen and sportspersons. Local, zonal and multi-zonal reservation under the AP Presidential Order and local cadre rules.'
const apRelaxations = [
  { category: 'SC, ST, BC and EWS', years: 5 },
  { category: 'PwBD', years: 10 },
  { category: 'AP State Government employees', years: 5, note: 'Based on service, as per notification.' },
  { category: 'Ex-servicemen / NCC instructors', years: 3, note: 'Plus length of service, as per notification.' },
]

export default [
  {
    id: 'appsc-group-1', name: 'APPSC Group-I Services', abbreviation: 'APPSC Group 1', jurisdiction: 'andhra-pradesh', sector: 'civil-services', organization: appsc,
    department: 'Government of Andhra Pradesh (Revenue, Police, State Tax, Education, Panchayat Raj and other departments)',
    summary: 'Andhra Pradesh\'s top state service exam: Deputy Collector, DSP, Assistant Commissioner of State Tax, District Educational Officer, Divisional Development Officer and more. Objective Screening test, five descriptive Main papers plus qualifying Telugu and English, and a 75-mark interview (825 marks in all).',
    recruitmentMethods: ['competitive-exam', 'interview', 'medical-exam', 'document-verification'], frequency: 'Irregular (notified every 1 to 3 years)',
    officialLinks: [{ label: 'Notification 07/2026', url: `${docs}/Group_I_07_2026.pdf` }, { label: 'APPSC website', url: 'https://psc.ap.gov.in' }],
    status: { type: 'active', note: 'Notification 07/2026 (166 posts) is open: applications 6 to 27 October 2026; Screening test on 24 January 2027; Main exam dates to be announced.', cycles: [{ cycle: 'Notification 07/2026', events: [
      { event: 'Notification and applications open', date: '2026-10-06', dateType: 'official', source: 's1' },
      { event: 'Last date to apply (11:59 PM)', date: '2026-10-27', dateType: 'official', source: 's1' },
      { event: 'Screening test (OMR)', date: '2027-01-24', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Deputy Collector (A.P. Civil Service, Executive)', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 61960, responsibilities: 'Revenue Divisional Officer and district administration; can rise to IAS by conferment.', notes: '12 posts. Age 18 to 44.' },
      { name: 'Assistant Commissioner of State Tax', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 61960, responsibilities: 'GST administration in the state.', notes: '14 posts.' },
      { name: 'Deputy Superintendent of Police (Civil) Cat-2', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 61960, ageMin: 21, ageMax: 30, responsibilities: 'Sub-division police officer.', notes: '36 posts (3 carried forward). Age 21 to 30; physical standards apply.' },
      { name: 'DSP (Communications)', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 61960, ageMax: 30, responsibilities: 'Police communications.', notes: '3 posts. Age 18 to 30.' },
      { name: 'District Educational Officer', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 61960, responsibilities: 'Heads school education in a district.', notes: '14 posts.' },
      { name: 'Divisional Development Officer (Panchayat Raj)', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 65360, responsibilities: 'Rural development and panchayat supervision.', notes: '35 posts. Scale 65,360-1,54,980.' },
      { name: 'Regional Transport Officer', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Transport department regional head.', notes: '3 posts.' },
      { name: 'Deputy Registrar (Cooperative)', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Cooperative societies regulation.', notes: '16 posts (1 carried forward).' },
      { name: 'District Tribal Welfare Officer', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 57100, responsibilities: 'Tribal welfare schemes.', notes: '1 post.' },
      { name: 'Municipal Commissioner Grade-II', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 54060, responsibilities: 'Runs a municipality.', notes: '12 posts.' },
      { name: 'Assistant Treasury Officer / Assistant Accounts Officer', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 54060, responsibilities: 'Treasury and accounts.', notes: '2 posts.' },
      { name: 'District Employment Officer', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 54060, responsibilities: 'Employment exchange.', notes: '3 posts (1 carried forward).' },
      { name: 'Assistant Audit Officer (State Audit)', group: 'Group-I', payLevel: 'RPS 2022', startingBasic: 54060, responsibilities: 'Audit of local bodies.', notes: '15 posts.' }],
    eligibility: {
      age: { summary: 'Minimum 18 (21 for DSP Civil) and maximum 44 (30 for DSP posts) on 1 July 2026, under Rule 12 of the APS&SS Rules 1996 read with G.O.Ms.No.187 and 188 GA (Ser-A) of 14 Sep 2026.', referenceDate: '1 July of the notification year (1 Jul 2026)', relaxations: apRelaxations },
      nationality: 'Citizen of India.',
      domicile: 'Local status under the AP local cadre rules matters for zonal and multi-zonal reservation; non-locals can compete for open, non-local quotas as per rules.',
      education: { summary: 'A bachelor\'s degree from a recognised university for most posts; some posts specify subjects or preferences (see the notification).', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      physical: 'DSP posts have physical and medical standards (Annexure V).',
      examVsPost: 'One exam, 13 kinds of posts with different age limits (DSP 30, others 44). You give post and multi-zone or zone preferences online before Mains and again at certificate verification; preferences at verification are mandatory.',
      disqualifications: ['Absence in any Screening or Main paper disqualifies the candidate.'],
      reservation: apReservation,
    },
    eligibilityRules: { ageMin: 18, ageMax: 44, ageReferenceDate: '2026-07-01', minEducation: 'graduate', relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }, domicile: 'andhra-pradesh', notes: 'DSP posts: 21 (Civil) to 30. Age relaxation for SC, ST, BC and EWS is 5 years.' },
    selection: {
      stages: [
        { name: 'Screening test (objective, OMR)', type: 'objective', countsInMerit: false, papers: [
          { name: 'Paper I: General Studies (history and culture; constitution, polity, social justice, IR; Indian and AP economy and planning; geography)', marks: 120, questions: 120, duration: '120 minutes', negative: 'One third of the marks' },
          { name: 'Paper II: General Aptitude (mental ability, administrative and psychological abilities; science and technology; current events)', marks: 120, questions: 120, duration: '120 minutes', negative: 'One third of the marks' }], notes: 'Shortlists 50 times the vacancies for Mains, irrespective of community. Relaxed standards may be applied for SC, ST, BC and PwBD to fill reserved vacancies.' },
        { name: 'Main exam (descriptive)', type: 'descriptive', countsInMerit: true, papers: [
          { name: 'Telugu (qualifying)', marks: 150, duration: '180 minutes', qualifying: true },
          { name: 'English (qualifying)', marks: 150, duration: '180 minutes', qualifying: true },
          { name: 'Paper I: General Essay', marks: 150, duration: '180 minutes' },
          { name: 'Paper II: History, Culture and Geography of India and AP', marks: 150, duration: '180 minutes' },
          { name: 'Paper III: Polity, Constitution, Governance, Law and Ethics', marks: 150, duration: '180 minutes' },
          { name: 'Paper IV: Economy and Development of India and AP', marks: 150, duration: '180 minutes' },
          { name: 'Paper V: Science, Technology and Environmental Issues', marks: 150, duration: '180 minutes' }], notes: 'All papers are compulsory; absence in any paper disqualifies.' },
        { name: 'Interview (Personality Test)', type: 'interview', countsInMerit: true, papers: [{ name: 'Interview', marks: 75 }] },
        { name: 'Certificate verification and medical', type: 'document', countsInMerit: false }],
      meritCalculation: 'Final merit = Main written (5 papers, 750) + interview (75) = 825. Minimum aggregate: OC, sportspersons and EWS 40%; BC 35%; SC, ST and PwBD 30%.', tieBreaking: 'Equal Mains totals are bracketed and ranked by age (oldest first); then by the earlier date of qualification. Where a preferential qualification is prescribed, it takes priority over age.',
      normalization: 'None stated.', languages: 'Main exam medium option (English or Telugu, as offered) is taken online before Mains.', documentVerification: 'Before final selection, with post and zone preferences.', probation: 'As per AP State and Subordinate Service Rules.',
    },
    syllabus: { officialLink: `${docs}/Group_I_07_2026.pdf`, sections: [
      { stage: 'Screening', subject: 'Paper I: General Studies (degree standard)', topics: ['History and culture: Indus Valley to modern India, including AP history', 'Constitution, polity, social justice and international relations', 'Indian and Andhra Pradesh economy and planning', 'Geography of India and AP'] },
      { stage: 'Screening', subject: 'Paper II: General Aptitude', topics: ['General mental ability, administrative and psychological abilities', 'Science and technology', 'Current events of regional, national and international importance'] },
      { stage: 'Main', subject: 'Five merit papers', topics: ['General essay on contemporary themes', 'History, culture and geography of India and AP', 'Polity, constitution, governance, law and ethics', 'Economy and development of India and AP', 'Science, technology and environmental issues'] }],
      supplementary: ['AP-specific history, economy and policy carry heavy weight in both stages.', 'The full syllabus is in Annexure II of the notification.'] },
    syllabusTags: ['indian-history', 'ap-history-culture', 'indian-polity', 'international-relations', 'indian-economy', 'ap-economy-policy', 'geography', 'reasoning', 'science-technology', 'current-affairs', 'essay-writing', 'ethics', 'governance', 'environment', 'telugu-language', 'english-language', 'interview-personality'],
    statistics: [{ year: 2026, vacancies: 166, note: 'Notification 07/2026 (includes carried-forward vacancies).', source: 's1' }],
    rankAndAllocation: { text: 'Candidates are selected in merit order against post and zone preferences, applying community, local and horizontal reservations. Carried-forward reserved vacancies are filled first.' },
    salary: { payRuleSet: 'ap-rps-2022', payLevel: 'AP RPS 2022', payScale: '54,060 to 1,54,980 (by post)', startingBasic: 61960, pension: 'Contributory Pension Scheme for those joining after 1 Sep 2004.', increments: 'Annual increment in the scale.', notes: 'Starting basic shown is Deputy Collector / DSP / ACST (61,960-1,51,370). DDO starts at 65,360; Municipal Commissioner Gr-II and others at 54,060.' },
    career: { progression: [
      { post: 'Deputy Collector (RDO)', level: 'Group-I', timeline: 'Entry', timelineType: 'official' },
      { post: 'Special Grade Deputy Collector / Joint Collector cadre', level: 'Higher state scale', timeline: 'By promotion', timelineType: 'typical' },
      { post: 'IAS (by conferment from state civil service)', level: 'IAS', timeline: 'Senior, through the select list', timelineType: 'typical' }],
      promotionNotes: 'State civil service officers can be appointed to the IAS by promotion through the UPSC select list after many years of service. DSPs can be promoted to IPS similarly.', macp: 'Automatic Advancement Scheme as per AP rules.', sources: ['s1'] },
    benefits: [{ item: 'State government benefits', detail: 'HRA or quarters, medical (EHS), leave and LTC as per AP rules.', conditional: false, sources: ['s1'] }],
    workLife: { postings: 'Anywhere in Andhra Pradesh by zone and multi-zone.', transfers: 'Every 2 to 3 years.', nature: 'Field administration, policing, tax enforcement.', workload: 'High.', publicInteraction: 'Very high.', hazards: 'Moderate for police posts.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'high', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'high', rationale: 'Five descriptive papers and an interview for only 166 posts; earlier Group-I cycles drew lakhs of applicants.' },
    ratings: { careerGrowth: 'high', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Top state posts with a path to IAS/IPS, but notifications are irregular.' },
    risk: { overall: 'high', factors: [
      { factor: 'Irregular recruitment', level: 'high', note: 'Group-I is notified every few years.' },
      { factor: 'Litigation history', level: 'high', note: 'Earlier AP Group-I recruitments were challenged in court and delayed.' },
      { factor: 'Long cycle', level: 'high', note: 'Notification to final result usually takes 1 to 2 years.' }] },
    guide: { sections: [
      { title: 'How AP Group-I works', kind: 'official', quickFacts: [{ label: 'Posts 2026', value: '166' }, { label: 'Final marks', value: '825' }, { label: 'Screening', value: '24 Jan 2027' }],
        paragraphs: ['Three stages. The Screening test (two objective papers of 120 marks) only shortlists, about 50 candidates per vacancy. Mains has five descriptive papers of 150 marks each plus two qualifying language papers (Telugu and English). The interview carries 75 marks.'],
        table: { columns: ['Stage', 'Papers', 'Marks', 'Counts in rank?'], rows: [['Screening', 'General Studies + General Aptitude', '240', 'No'], ['Mains', 'Telugu, English (qualifying)', '150 each', 'No'], ['Mains', 'Essay, History, Polity, Economy, Science', '750', 'Yes'], ['Interview', 'Personality test', '75', 'Yes']] } },
      { title: 'Minimum marks and ties', kind: 'official', quickFacts: [{ label: 'OC / EWS', value: '40%' }, { label: 'BC', value: '35%' }, { label: 'SC / ST / PwBD', value: '30%' }],
        paragraphs: ['To be selected you must reach the minimum aggregate for your category. If totals are equal, the older candidate ranks higher.'] },
      { title: 'Common confusions', kind: 'explainer', bullets: ['DSP posts have a lower upper age (30) and physical standards; other posts allow up to 44.', 'The Screening test marks are not added to your final score.', 'You must give post and zone preferences at certificate verification even if you gave them before Mains.'] }] },
    sources: [['s1', 'APPSC Notification No. 07/2026: Group-I Services', `${docs}/Group_I_07_2026.pdf`, 'Andhra Pradesh Public Service Commission', 2026]],
    dataQuality: { confidence: 'high', gaps: ['Official cutoffs and applicant counts for earlier cycles not collected.', 'SC sub-categorisation details summarised.'], notes: 'From the official notification.' },
  },
  {
    id: 'appsc-group-2', name: 'APPSC Group-II Services', abbreviation: 'APPSC Group 2', jurisdiction: 'andhra-pradesh', sector: 'revenue-clerical', organization: appsc,
    department: 'Government of Andhra Pradesh (Revenue, Panchayat Raj, Commercial Tax, Secretariat, Treasuries, Excise and others)',
    summary: 'Large Andhra Pradesh recruitment for executive and non-executive posts: Deputy Tahsildar, Deputy MPDO, GST Officer, Sub-Registrar, Assistant Section Officer, Excise SI, Senior and Junior Accountants and more. An objective Screening test and an objective two-paper Mains; no interview.',
    recruitmentMethods: ['competitive-exam', 'skill-test', 'document-verification'], frequency: 'Irregular (notified every 1 to 3 years)',
    officialLinks: [{ label: 'Brief Notification 37/2026', url: `${docs}/Group_II_372026.pdf` }],
    status: { type: 'active', note: 'Brief Notification 37/2026 (686 posts) issued on 13 October 2026. Applications 10 to 30 November 2026; detailed notification with age and Screening date due by 10 November 2026.', cycles: [{ cycle: 'Notification 37/2026', events: [
      { event: 'Brief notification', date: '2026-10-13', dateType: 'official', source: 's1' },
      { event: 'Applications open', date: '2026-11-10', dateType: 'official', source: 's1' },
      { event: 'Last date to apply', date: '2026-11-30', dateType: 'official', source: 's1' }] }] },
    posts: [
      { name: 'Deputy Tahsildar (A.P. Revenue Service)', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 44570, responsibilities: 'Mandal revenue administration.', notes: '200 posts.' },
      { name: 'Deputy Mandal Parishad Development Officer', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 45830, responsibilities: 'Mandal-level rural development.', notes: '176 posts.' },
      { name: 'Goods and Service Tax Officer (erstwhile ACTO)', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 45830, responsibilities: 'State GST assessment.', notes: '40 posts.' },
      { name: 'Municipal Commissioner Grade-III', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 45830, responsibilities: 'Runs a small municipality.', notes: '6 posts.' },
      { name: 'Assistant Registrar of Cooperative Societies', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 45830, responsibilities: 'Cooperative regulation.', notes: '10 posts.' },
      { name: 'Sub-Registrar Grade-II', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 44570, responsibilities: 'Registration of documents.', notes: '7 posts. Law degree preferred.' },
      { name: 'Prohibition and Excise Sub-Inspector', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 40970, responsibilities: 'Excise enforcement.', notes: '29 posts. Physical requirements apply.' },
      { name: 'Assistant Section Officer (GAD / Finance / Law)', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 40970, responsibilities: 'AP Secretariat work.', notes: '71 + 5 + 4 posts. Finance needs a Maths, Economics or Commerce degree; Law needs a law degree.' },
      { name: 'Senior Accountant (Treasuries and Accounts)', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 34580, responsibilities: 'Accounts in HODs.', notes: '90 posts. Computer certificate or computer degree required.' },
      { name: 'Junior Accountant', group: 'Group-II', payLevel: 'RPS 2022', startingBasic: 25220, responsibilities: 'Accounts in departments.', notes: '48 posts.' }],
    eligibility: {
      age: { summary: 'Set in the detailed notification (due by 10 November 2026). For reference, Group-I 07/2026 used 18 to 44 on 1 July 2026 under G.O.Ms.No.187 and 188 of 14 Sep 2026.', referenceDate: 'Date of detailed notification is the crucial date', relaxations: apRelaxations },
      nationality: 'Citizen of India.',
      domicile: 'Local cadre and zonal rules apply.',
      education: { summary: 'Bachelor\'s degree for most posts. ASO (Finance): degree in Maths, Economics or Commerce. ASO (Law): law degree. Senior and Junior Accountant: degree plus a BTET computer certificate (Office Automation, PC Maintenance or Web Designing) or a computer degree.', finalYearAllowed: false, minMarks: null },
      attempts: [{ category: 'All', limit: 'No attempt limit' }],
      physical: 'Excise SI has physical requirements (see detailed notification).',
      examVsPost: 'Some posts need specific degrees or computer certificates; check each post.',
      reservation: apReservation,
    },
    eligibilityRules: { ageMin: 18, ageMax: 44, minEducation: 'graduate', relaxationYears: { OBC: 5, SC: 5, ST: 5, EWS: 5, PwBD: 10 }, domicile: 'andhra-pradesh', notes: 'Age limits confirmed only in the detailed notification; 44 is the Group-I 2026 limit, used here as an envelope.' },
    selection: {
      stages: [
        { name: 'Screening test (objective, OMR)', type: 'objective', countsInMerit: false, papers: [{ name: 'General Studies and Mental Ability (degree standard)', marks: 150, questions: 150, duration: '150 minutes', negative: 'One third of the marks' }] },
        { name: 'Main exam (objective)', type: 'objective', countsInMerit: true, papers: [
          { name: 'Paper I: Social history of AP (social and cultural movements); overview of the Indian Constitution', marks: 150, questions: 150, duration: '150 minutes', negative: 'One third' },
          { name: 'Paper II: Indian and AP economy; science and technology', marks: 150, questions: 150, duration: '150 minutes', negative: 'One third' }] },
        { name: 'Computer Proficiency Test (specified posts)', type: 'skill', countsInMerit: false, notes: 'Practical, qualifying.' },
        { name: 'Certificate verification', type: 'document', countsInMerit: false }],
      meritCalculation: 'Merit from the Main exam (300 marks). No interview.', languages: 'English and Telugu.', documentVerification: 'After Mains.', probation: 'As per AP rules.',
    },
    syllabus: { officialLink: `${docs}/Group_II_372026.pdf`, sections: [
      { stage: 'Screening', subject: 'General Studies and Mental Ability', topics: ['History, geography, polity, economy of India and AP', 'Current affairs', 'Mental ability and reasoning'] },
      { stage: 'Main', subject: 'Paper I', topics: ['Social history of Andhra Pradesh: social and cultural movements', 'General overview of the Indian Constitution'] },
      { stage: 'Main', subject: 'Paper II', topics: ['Indian and AP economy', 'Science and technology'] }] },
    syllabusTags: ['ap-history-culture', 'indian-polity', 'indian-economy', 'ap-economy-policy', 'science-technology', 'current-affairs', 'reasoning', 'geography', 'computer-awareness'],
    statistics: [{ year: 2026, vacancies: 686, note: 'Brief Notification 37/2026 (provisional).', source: 's1' }],
    rankAndAllocation: { text: 'Merit-cum-preference across posts, with community, local and horizontal reservations.' },
    salary: { payRuleSet: 'ap-rps-2022', payLevel: 'AP RPS 2022', payScale: '25,220 to 1,30,580 (by post)', startingBasic: 44570, pension: 'Contributory Pension Scheme.', increments: 'Annual increment in the scale.', notes: 'Starting basic shown is Deputy Tahsildar (44,570-1,27,480). Executive posts like Deputy MPDO and GST Officer start at 45,830.' },
    career: { progression: [
      { post: 'Deputy Tahsildar', level: 'Group-II', timeline: 'Entry', timelineType: 'official' },
      { post: 'Tahsildar (Mandal Revenue Officer)', level: 'Higher scale', timeline: 'By promotion', timelineType: 'typical' },
      { post: 'Deputy Collector', level: 'Group-I', timeline: 'Senior, by promotion', timelineType: 'typical' }],
      promotionNotes: 'Departmental tests conducted by APPSC are needed for many promotions.', departmentalExams: 'APPSC departmental tests (held twice a year).', macp: 'Automatic Advancement Scheme as per AP rules.', sources: ['s1'] },
    benefits: [{ item: 'State government benefits', detail: 'HRA or quarters, EHS, leave and LTC as per AP rules.', conditional: false, sources: ['s1'] }],
    workLife: { postings: 'Mandals, municipalities and offices across AP by zone.', transfers: 'Every 2 to 3 years.', nature: 'Field (revenue, panchayat, tax) or desk (Secretariat, accounts).', workload: 'High in revenue posts.', publicInteraction: 'Very high.', hazards: 'Low.', stability: 'Very high.' },
    difficulty: { syllabusDepth: 'medium', competition: 'high', timePressure: 'medium', technicalComplexity: 'low', physicalRequirements: 'low', selectionUncertainty: 'medium', rationale: 'Fully objective, AP-focused syllabus; competition for about 700 posts is very high.' },
    ratings: { careerGrowth: 'medium', locationFlexibility: 'medium', recruitmentRegularity: 'low', rationale: 'Good state posts but notified irregularly.' },
    risk: { overall: 'high', factors: [{ factor: 'Irregular recruitment', level: 'high', note: 'Every few years.' }, { factor: 'Litigation', level: 'medium', note: 'Past cycles faced court cases over reservation rosters.' }] },
    sources: [['s1', 'APPSC Brief Notification No. 37/2026: Group-II Services', `${docs}/Group_II_372026.pdf`, 'Andhra Pradesh Public Service Commission', 2026]],
    dataQuality: { confidence: 'medium', gaps: ['Age limits and Screening date are in the detailed notification, not yet read.', 'Computer Proficiency Test post list not reproduced.'], notes: 'Posts, pay scales, qualifications and scheme from the brief notification.' },
  },
]
