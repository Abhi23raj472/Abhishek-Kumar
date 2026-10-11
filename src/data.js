export const profile = {
  name: 'Abhishek Kumar',
  role: 'Quality Engineer',
  focus: 'Test Automation · Tricentis Tosca',
  company: 'Optum Global Solutions',
  location: 'India',
  email: 'rajputabhishek677@gmail.com',
  linkedin: 'https://www.linkedin.com/in/abhishek-kumar2301',
  resume: 'Abhishek_Kumar_Resume.pdf',
}

// Report sections, in order. `no` is the section number printed in the margin.
export const nav = [
  { id: 'about', no: '1.0', label: 'Summary' },
  { id: 'work', no: '2.0', label: 'Scope' },
  { id: 'impact', no: '3.0', label: 'Findings' },
  { id: 'experience', no: '4.0', label: 'Record' },
  { id: 'skills', no: '5.0', label: 'Skills' },
  { id: 'credentials', no: '6.0', label: 'Certified' },
  { id: 'contact', no: '7.0', label: 'Contact' },
]

export const roles = [
  'Tosca automation',
  'API validation',
  'parallel execution',
  'CI/CD quality gates',
  'release confidence',
]

// Words wrapped in *asterisks* are highlighted as the paragraph lights up on scroll.
export const intro =
  "I'm a *Quality* *Engineer* with five years across test automation, API validation and Agile QA. I build *Tricentis* *Tosca* suites that stay maintainable long after the release they were written for — reusable modules, data-driven design and distributed execution, wired into *CI/CD* so every build ships with *confidence.*"

export const stats = [
  { v: 5, suffix: '+', k: 'years in quality engineering' },
  { v: 12, suffix: '', k: 'certifications earned' },
  { v: 4, suffix: '', k: 'awards & recognitions' },
  { v: 0, suffix: '', k: 'UAT escalations across sprint cycles' },
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
  { name: 'CI/CD & DEX', short: 'CI/CD & DEX', level: 'advanced', pct: 82 },
  { name: 'Agile / Scrum', short: 'Agile', level: 'advanced', pct: 85 },
  { name: 'SQL / MySQL', short: 'SQL', level: 'proficient', pct: 70 },
]

export const stack = [
  { k: 'automation', v: ['Tosca', 'XScan', 'TCD', 'DEX', 'TQL'] },
  { k: 'api', v: ['Postman', 'SoapUI', 'Tosca API'] },
  { k: 'testing', v: ['Functional', 'Regression', 'Smoke', 'API', 'UI', 'DB'] },
  { k: 'collab', v: ['JIRA', 'Confluence', 'ALM', 'Rally'] },
  { k: 'method', v: ['Scrum', 'Kanban', 'SDLC', 'STLC'] },
]

export const competencies = [
  'Test case design', 'Test data management', 'Risk-based testing', 'Requirement analysis',
  'Regression planning', 'Agile test strategy', 'Coverage mapping', 'Release alignment', 'Sprint testing',
]

export const experience = [
  {
    role: 'Quality Engineer',
    org: 'Optum Global Solutions',
    place: 'UnitedHealth Group',
    period: 'Nov 2025 — Present',
    current: true,
    points: [
      "Extend the team's Tricentis Tosca framework with new automation suites for web and desktop applications.",
      'Scan new interfaces with Tosca XScan into reusable UI modules, widening automation coverage.',
      'Design parameterized, data-driven test cases in Tosca TCD to validate new features each release.',
      'Run functional, smoke and regression cycles every sprint, aligned with Agile ceremonies.',
      'Build recovery and cleanup scenarios that keep test runs stable when environments are unreliable.',
      "Caught and escalated a critical production-impacting defect, earning UnitedHealth Group's Bravo! Diamond Award.",
      'Triage and track defects in JIRA with developers to close issues quickly and cut re-testing.',
      'Help integrate Tosca runs into the CI/CD pipeline and publish daily regression reports on suite health.',
    ],
    tags: ['Tosca', 'XScan', 'TCD', 'Recovery', 'JIRA', 'CI/CD'],
  },
  {
    role: 'Senior Software Engineer',
    org: 'Expleo Group',
    place: 'Pune, India',
    period: 'Sep 2021 — Nov 2025',
    points: [
      'Owned Tosca automation suite design and delivery for web and desktop applications, from architecture to rollout.',
      'Architected data-driven, parameterized Tosca TCD frameworks that scaled testing across multiple product lines.',
      'Led REST and SOAP API test coverage in Tosca and SoapUI, validating status codes, payloads and headers.',
      'Ran distributed, parallel execution on Tosca DEX across remote agents, using event-driven and scheduled runs.',
      'Cut regression cycle time by modularizing test cases and optimizing execution, recognized with the Applause Award.',
      'Set team-wide standards for reusable XScan modules, shared test sheets, business-rule templates and TQL bulk updates.',
      'Defined release-level test strategy (scope, risk coverage and test data) and drove CI/CD integration of automation suites.',
      'Mentored teammates through test reviews and led retrospectives to raise QA standards across the team.',
    ],
    tags: ['Tosca', 'DEX', 'TQL', 'API', 'SoapUI', 'Mentoring'],
  },
]

export const impact = [
  { code: 'I-01', title: 'Faster regression cycles', metric: 'Regression cycle time', dir: 'down', body: 'Reduced regression cycle duration by modularizing test cases and enabling distributed execution.' },
  { code: 'I-02', title: 'Broader API coverage', metric: 'API test coverage', dir: 'up', body: 'Increased API test coverage through automated validation of payloads, status codes and authentication.' },
  { code: 'I-03', title: 'Lower maintenance', metric: 'Maintenance effort', dir: 'down', body: 'Minimized maintenance effort by building reusable templates and centralizing test data in TCD.' },
  { code: 'I-04', title: 'Higher DEX throughput', metric: 'DEX throughput', dir: 'up', body: 'Improved Tosca DEX throughput through optimized agent load balancing and parallel run configuration.' },
  { code: 'I-05', title: 'Zero UAT escalations', metric: 'UAT escalations', dir: 'zero', body: 'Delivered defect-free releases across multiple sprint cycles with zero UAT escalations, recognized by the client.' },
  { code: 'I-06', title: 'Ahead of schedule', metric: 'Delivery date', dir: 'early', body: 'Delivered critical automation ahead of schedule, improving QA timelines and early feedback cycles.' },
]

export const certs = [
  { org: 'Tricentis Academy', items: ['AS1', 'AS2', 'TDS1', 'TDS2', 'AE1', 'API', 'TQL'] },
  { org: 'ISTQB', items: ['Certified Tester — Foundation Level'] },
  { org: 'Optum.ai', items: ['Generative AI · AI Dojo · Mar 2026'] },
  { org: 'Allianz', items: ['ABS (L1)', 'SQL Certification', 'Agile with Atlassian Jira'] },
]

export const awards = [
  { date: 'Jun 2026', name: 'Bravo! Diamond Award', by: 'UnitedHealth Group', body: 'Proactively identified and escalated a critical production-impacting defect in the Tosca Automation team.' },
  { date: 'Dec 2024', name: 'Bold Mind Award', body: 'For innovative solutions and test strategy enhancement in Tosca.' },
  { date: 'Apr 2024', name: 'Applause Award', body: 'For reducing regression cycle time through automation optimization.' },
  { date: 'Sep 2023', name: 'WoW Award', body: 'For exceptional contribution to enterprise automation delivery.' },
]

export const education = { degree: 'Bachelor of Technology — Computer Science & Engineering', school: 'Galgotias University, Greater Noida, UP', year: '2021' }

// The hero's title block.
export const record = [
  ['Name', 'Abhishek Kumar'],
  ['Role', 'Quality Engineer'],
  ['Organisation', 'Optum Global Solutions, UnitedHealth Group'],
  ['Location', 'India'],
  ['Experience', '5+ years in quality engineering'],
  ['Specialty', 'Tricentis Tosca, API validation, CI/CD'],
]

// Skills sphere. Weight 1-3 sets the size of each tag.
export const skillCats = [
  { id: 'automation', label: 'Automation' },
  { id: 'api', label: 'API & data' },
  { id: 'testing', label: 'Testing' },
  { id: 'delivery', label: 'Delivery & tools' },
]

// Added most recently (from the 2026 resume), shown first in Skills.
export const latest = [
  { name: 'Generative AI', note: 'Optum.ai AI Dojo', date: 'Mar 2026' },
  { name: 'Recovery & cleanup scenarios', note: 'Stable Tosca runs on unstable environments', date: 'Optum' },
  { name: 'Suite-health reporting', note: 'Daily regression reports from CI/CD runs', date: 'Optum' },
]

export const skillCloud = [
  ['Tricentis Tosca', 'automation', 3],
  ['XScan', 'automation', 2],
  ['TCD', 'automation', 2],
  ['Tosca DEX', 'automation', 3],
  ['TQL', 'automation', 1],
  ['Recovery & cleanup scenarios', 'automation', 1],
  ['Reusable modules', 'automation', 2],
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
  ['CI/CD', 'delivery', 3],
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
