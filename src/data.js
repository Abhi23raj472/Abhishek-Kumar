export const profile = {
  name: 'Abhishek Kumar',
  role: 'Quality Engineer',
  focus: 'Test Automation · Tricentis Tosca',
  company: 'Optum Global Solutions',
  location: 'Gurugram, India',
  email: 'rajputabhishek677@gmail.com',
  linkedin: 'https://www.linkedin.com/in/abhishek-kumar2301',
  resume: 'Abhishek_Kumar_Resume.pdf',
}

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'impact', label: 'Impact' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'credentials', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
]

export const roles = [
  'Tosca automation',
  'API validation',
  'parallel execution',
  'regression automation',
  'release confidence',
]

// Words wrapped in *asterisks* are highlighted as the paragraph lights up on scroll.
export const intro =
  "I'm a *Quality* *Engineer* with five years across test automation, API validation and Agile QA. I build *Tricentis* *Tosca* suites that stay maintainable long after the release they were written for — reusable XScan modules and data-driven TCD design, run in parallel on Tosca DEX so every release ships with *confidence.*"

export const stats = [
  { v: 5, suffix: '+', k: 'years in quality engineering' },
  { v: 12, suffix: '', k: 'certifications earned' },
  { v: 4, suffix: '', k: 'awards & recognitions' },
  { v: 2, suffix: '', k: 'global enterprises' },
]

export const marquee = [
  'Tricentis Tosca', 'Tosca DEX', 'TCD', 'XScan', 'TQL', 'API Testing', 'Postman',
  'SoapUI', 'JIRA', 'Confluence', 'CI/CD', 'Agile', 'MySQL', 'ISTQB',
]

export const doing = [
  { code: 'D-01', title: 'Scalable suites', body: 'Web and desktop automation in Tricentis Tosca, built on reusable XScan modules and shared libraries.' },
  { code: 'D-02', title: 'API coverage', body: 'REST and SOAP validation of payloads, status codes, headers and auth — inside Tosca, Postman and SoapUI.' },
  { code: 'D-03', title: 'Parallel execution', body: 'Distributed runs via Tosca DEX across remote agents, with load balancing for faster feedback.' },
  { code: 'D-04', title: 'Defect lifecycle', body: 'Triage and tracking in JIRA, working with developers to close issues fast and limit re-testing.' },
]

export const proficiency = [
  { name: 'Tricentis Tosca', short: 'Tosca', level: 'expert', pct: 95 },
  { name: 'API testing (REST / SOAP)', short: 'API testing', level: 'advanced', pct: 85 },
  { name: 'Tosca DEX (parallel execution)', short: 'Tosca DEX', level: 'advanced', pct: 85 },
  { name: 'Agile / Scrum', short: 'Agile', level: 'advanced', pct: 85 },
  { name: 'SQL / MySQL', short: 'SQL', level: 'proficient', pct: 70 },
]

export const stack = [
  { k: 'automation', v: ['Tosca', 'XScan', 'TCD', 'DEX', 'TQL', 'RTBs'] },
  { k: 'api', v: ['Postman', 'SoapUI', 'Tosca API'] },
  { k: 'testing', v: ['Functional', 'Regression', 'Smoke', 'API', 'UI', 'DB'] },
  { k: 'collab', v: ['JIRA', 'Confluence', 'ALM', 'Rally'] },
  { k: 'method', v: ['Scrum', 'Kanban', 'SDLC', 'STLC'] },
]

export const competencies = [
  'Test automation framework design', 'Regression automation', 'API testing (REST/SOAP)',
  'Risk-based testing', 'Test data management', 'Test case design', 'Agile / Scrum',
  'Release-level test strategy', 'Insurance & healthcare domains',
]

export const experience = [
  {
    role: 'Quality Engineer',
    org: 'Optum Global Solutions',
    place: 'Gurugram, India',
    period: 'Nov 2025 — Present',
    current: true,
    points: [
      'Automate end-to-end scenarios for healthcare web and desktop applications in Tricentis Tosca, adding 130+ automated test cases to the regression suite.',
      'Extend the shared XScan module library for new screens, reusing existing modules to keep suite maintenance low.',
      'Design parameterized, data-driven test cases in Tosca TCD to validate new features every sprint.',
      'Run functional and smoke cycles each sprint and execute 200+ regression test cases daily.',
      'Configure Recovery and Cleanup Scenarios that keep unattended runs stable through application and environment failures.',
      'Triage, log and track defects in JIRA with developers through to retest and closure; escalated a critical production-impacting defect recognized with the Bravo! Diamond Award.',
      'Publish daily regression reports on suite health, pass rates and failure trends for stakeholders.',
    ],
    tags: ['Tosca', 'XScan', 'TCD', 'Recovery', 'JIRA', 'Reporting'],
    // Headline results, shown before the full log.
    wins: [
      { k: 'Bravo! Diamond Award', v: 'Caught and escalated a critical production-impacting defect' },
      { k: '130+ test cases', v: 'Automated end-to-end healthcare scenarios added to the regression suite' },
      { k: '200+ daily', v: 'Regression test cases executed every day, with daily suite-health reports' },
    ],
  },
  {
    role: 'Senior Software Engineer',
    org: 'Expleo Group',
    place: 'Pune, India',
    period: 'Sep 2021 — Nov 2025',
    points: [
      'Designed 300+ Tosca test cases for Allianz insurance web and desktop applications and maintained the existing regression suite, keeping it stable and up to date across releases.',
      "Established the team's reusable UI module standards with Tosca XScan, extending automation to new interfaces and cutting maintenance effort by 50%.",
      'Built data-driven, parameterized test case designs in Tosca TCD, letting one test cover many data combinations and scaling coverage across multiple insurance product lines.',
      'Automated 120 of 300+ manual REST and SOAP API test cases with Tosca API Scan (~40% of the API suite), validating response codes, payloads, headers and authentication.',
      'Ran distributed, parallel regression runs through Tosca DEX across multiple remote agents using TestEvents and scheduled executions, contributing to the 40% reduction in regression cycle time.',
      'Standardized test logic with shared TestSheets, Reusable TestStep Blocks and business rule templates; used TQL searches for bulk maintenance of test artifacts.',
      'Shaped release-level test strategy covering scope, risk coverage and test data planning.',
      'Mentored junior teammates through automation and test case reviews, and led retrospectives that improved team-wide QA practices.',
    ],
    tags: ['Tosca', 'XScan', 'TCD', 'DEX', 'API Scan', 'TQL'],
    wins: [
      { k: '40% faster regression', v: 'Modular test cases run in parallel on Tosca DEX' },
      { k: '50% less maintenance', v: 'Reusable XScan module standards for the team' },
      { k: '120 API tests automated', v: '~40% of the manual REST/SOAP suite moved to Tosca API Scan' },
    ],
  },
]

export const impact = [
  { code: 'I-01', title: '40% faster regression', body: 'Cut regression cycle time by 40% by modularizing test cases and running them in parallel on Tosca DEX.' },
  { code: 'I-02', title: 'Broader API coverage', body: 'Converted ~40% of the manual API suite (120 of 300+ REST/SOAP test cases) into automated Tosca tests, removing repetitive manual execution.' },
  { code: 'I-03', title: '50% lower maintenance', body: 'Reduced test maintenance effort by 50% by building reusable templates and centralizing test data in TCD.' },
  { code: 'I-04', title: 'Bigger regression suite', body: 'Added 130+ automated test cases at Optum and execute 200+ regression test cases daily.' },
  { code: 'I-05', title: 'Stable releases', body: 'Supported stable releases across sprint cycles and UAT readiness, earning client recognition for delivery quality.' },
  { code: 'I-06', title: 'Ahead of schedule', body: 'Delivered critical automation ahead of schedule, giving teams earlier feedback in each QA cycle.' },
]

export const certs = [
  { org: 'Tricentis Academy', items: ['AS1', 'AS2', 'TDS1', 'TDS2', 'AE1', 'API Deep Dive', 'TQL'] },
  { org: 'ISTQB', items: ['Certified Tester — Foundation Level'] },
  { org: 'Optum.ai', items: ['Generative AI · AI Dojo, Mar 2026'] },
  { org: 'Allianz', items: ['ABS (L1)', 'SQL Certification', 'Agile with Atlassian Jira'] },
]

export const awards = [
  { date: 'Jun 2026', name: 'Bravo! Diamond Award', by: 'UnitedHealth Group', body: 'Identified and escalated a critical production-impacting defect as part of the Tosca Automation team.' },
  { date: 'Dec 2024', name: 'Bold Mind Award', by: 'Expleo Group', body: 'For innovative Tosca solutions and test strategy improvements.' },
  { date: 'Apr 2024', name: 'Applause Award', by: 'Expleo Group', body: 'For reducing regression cycle time through automation optimization.' },
  { date: 'Sep 2023', name: 'WoW Award', by: 'Expleo Group', body: 'For contributions to enterprise automation delivery.' },
]

export const education = { degree: 'Bachelor of Technology — Computer Science & Engineering', school: 'Galgotias University, Greater Noida, UP', year: '2021' }

// About: read out like a mission record.
export const record = [
  ['Name', 'Abhishek Kumar'],
  ['Role', 'Quality Engineer'],
  ['Organisation', 'Optum Global Solutions, UnitedHealth Group'],
  ['Base', 'Gurugram, India'],
  ['Experience', '5+ years in quality engineering'],
  ['Specialty', 'Tricentis Tosca, API validation, parallel execution (DEX)'],
  ['Education', 'B.Tech, Computer Science & Engineering, Galgotias University, 2021'],
]

export const skillCats = [
  { id: 'automation', label: 'Automation' },
  { id: 'api', label: 'API & data' },
  { id: 'testing', label: 'Testing' },
  { id: 'delivery', label: 'Delivery & tools' },
]

// Added most recently (from the 2026 resume); shown first in Skills.
export const latest = [
  { name: 'Generative AI', note: 'Optum.ai AI Dojo', when: 'Mar 2026' },
  { name: 'Recovery & cleanup scenarios', note: 'Stable Tosca runs on unstable environments', when: 'Optum' },
  { name: 'Suite-health reporting', note: 'Daily regression reports on pass rates and failure trends', when: 'Optum' },
  { name: 'CI/CD for Tosca', note: 'Pipeline-triggered runs and automated result reporting', when: 'Learning' },
]

// Skills catalogue. Weight 1-3 sets how brightly each one shows.
export const skillCloud = [
  ['Tricentis Tosca', 'automation', 3],
  ['XScan', 'automation', 2],
  ['TCD', 'automation', 2],
  ['Tosca DEX', 'automation', 3],
  ['TQL', 'automation', 1],
  ['Recovery & cleanup scenarios', 'automation', 2],
  ['Reusable modules', 'automation', 2],
  ['Reusable TestStep Blocks', 'automation', 2],
  ['TBox automation', 'automation', 1],
  ['ExecutionLists & TestEvents', 'automation', 1],
  ['REST', 'api', 3],
  ['SOAP', 'api', 2],
  ['Postman', 'api', 2],
  ['SoapUI', 'api', 2],
  ['Tosca API', 'api', 2],
  ['MySQL', 'api', 1],
  ['Test data', 'api', 1],
  ['Regression', 'testing', 3],
  ['Functional', 'testing', 2],
  ['Smoke', 'testing', 1],
  ['UI testing', 'testing', 1],
  ['Database testing', 'testing', 1],
  ['Requirement analysis', 'testing', 1],
  ['Risk-based testing', 'testing', 2],
  ['Test case design', 'testing', 2],
  ['Coverage mapping', 'testing', 1],
  ['ISTQB', 'testing', 1],
  ['CI/CD for Tosca', 'delivery', 2],
  ['JIRA', 'delivery', 2],
  ['Confluence', 'delivery', 1],
  ['ALM', 'delivery', 1],
  ['Rally', 'delivery', 1],
  ['Scrum', 'delivery', 2],
  ['Kanban', 'delivery', 1],
  ['SDLC', 'delivery', 1],
  ['STLC', 'delivery', 1],
  ['Generative AI', 'delivery', 2],
  ['MS Word, Excel, PowerPoint', 'delivery', 1],
]
