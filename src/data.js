export const profile = {
  name: 'Abhishek Kumar',
  role: 'Quality Engineer',
  focus: 'Test Automation · Tricentis Tosca',
  company: 'Optum Global Solutions',
  location: 'India',
  email: 'rajputabhishek677@gmail.com',
  linkedin: 'https://www.linkedin.com/in/abhishek-kumar2301',
  github: 'https://github.com/Abhi23raj472',
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
  { name: 'Tricentis Tosca', level: 'expert', pct: 95 },
  { name: 'API testing (REST / SOAP)', level: 'advanced', pct: 85 },
  { name: 'CI/CD & DEX', level: 'advanced', pct: 82 },
  { name: 'Agile / Scrum', level: 'advanced', pct: 85 },
  { name: 'SQL / MySQL', level: 'proficient', pct: 70 },
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
      "Develop and maintain automation suites for web and desktop applications in Tricentis Tosca within the team's established framework.",
      'Build and maintain reusable UI modules through Tosca XScan to broaden automation coverage across interfaces.',
      'Design parameterized, data-driven test cases in Tosca TCD to validate new feature functionality.',
      'Execute functional, smoke and regression cycles each sprint in line with Agile ceremonies.',
      'Engineer recovery and cleanup scenarios so test runs stay reliable during unstable environment states.',
      'Triage, log and track defects in JIRA, partnering with developers to close issues quickly and limit re-testing.',
      'Assist in integrating Tosca automation runs into the CI/CD pipeline; publish daily regression reports on suite health.',
    ],
    tags: ['Tosca', 'XScan', 'TCD', 'DEX', 'API', 'JIRA'],
  },
  {
    role: 'Senior Software Engineer',
    org: 'Expleo Group',
    place: 'Pune, India',
    period: 'Sep 2021 — Nov 2025',
    points: [
      'Owned end-to-end Tosca automation suite design and delivery for web and desktop applications, from architecture through rollout.',
      "Established the team's reusable UI module standards via Tosca XScan, extending automation feasibility to new interfaces.",
      'Architected data-driven, parameterized test frameworks in Tosca TCD to scale testing across multiple product lines.',
      'Led REST and SOAP API test coverage, validating response codes, payloads and headers in real time.',
      'Ran distributed, parallel test execution via Tosca DEX across remote agents using event-driven and scheduled runs.',
      'Standardized test scenario logic across the team with shared test sheets, business rule templates and TQL-driven bulk artifact updates.',
      'Defined release-level test strategy (scope, risk coverage and test data planning) and drove CI/CD integration of automation suites.',
      'Mentored teammates through code/test reviews and led retrospectives to raise team-wide QA standards.',
    ],
    tags: ['Tosca', 'DEX', 'TQL', 'CI/CD', 'SoapUI', 'Mentoring'],
  },
]

export const impact = [
  { code: 'I-01', title: 'Faster regression cycles', body: 'Reduced regression cycle duration by modularizing test cases and enabling distributed execution.' },
  { code: 'I-02', title: 'Broader API coverage', body: 'Increased API test coverage through automated validation of payloads, status codes and authentication.' },
  { code: 'I-03', title: 'Lower maintenance', body: 'Minimized maintenance effort by building reusable templates and centralizing test data in TCD.' },
  { code: 'I-04', title: 'Higher DEX throughput', body: 'Improved Tosca DEX throughput through optimized agent load balancing and parallel run configuration.' },
  { code: 'I-05', title: 'Zero UAT escalations', body: 'Delivered defect-free releases across multiple sprint cycles with zero UAT escalations, recognized by the client.' },
  { code: 'I-06', title: 'Ahead of schedule', body: 'Delivered critical automation ahead of schedule, improving QA timelines and early feedback cycles.' },
]

export const certs = [
  { org: 'Tricentis Academy', items: ['AS1', 'AS2', 'TDS1', 'TDS2', 'AE1', 'API', 'TQL'] },
  { org: 'ISTQB', items: ['Certified Tester — Foundation Level'] },
  { org: 'Generative AI', items: ['Optum.ai AI Dojo · Mar 2026'] },
  { org: 'Other', items: ['Allianz ABS (L1)', 'SQL Certification', 'Agile with Atlassian Jira'] },
]

export const awards = [
  { date: 'Jun 2026', name: 'Bravo! Diamond Award', by: 'UnitedHealth Group', body: 'Proactively identified and escalated a critical production-impacting defect in the Tosca Automation team.' },
  { date: 'Dec 2024', name: 'Bold Mind Award', body: 'For innovative solutions and test strategy enhancement in Tosca.' },
  { date: 'Apr 2024', name: 'Applause Award', body: 'For reducing regression cycle time through automation optimization.' },
  { date: 'Sep 2023', name: 'WoW Award', body: 'For exceptional contribution to enterprise automation delivery.' },
]

export const education = { degree: 'Bachelor of Technology — Computer Science & Engineering', school: 'Galgotias University, Greater Noida, UP', year: '2021' }

// About: read out like a mission record.
export const record = [
  ['Name', 'Abhishek Kumar'],
  ['Role', 'Quality Engineer'],
  ['Organisation', 'Optum Global Solutions, UnitedHealth Group'],
  ['Base', 'India'],
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

export const skillCloud = [
  ['Tricentis Tosca', 'automation', 3],
  ['XScan', 'automation', 2],
  ['TCD', 'automation', 2],
  ['Tosca DEX', 'automation', 3],
  ['TQL', 'automation', 1],
  ['Recovery scenarios', 'automation', 1],
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
]
