/**
 * store.js
 * -------------------------------------------------------------------------
 * A minimal in-memory "database" so the system can be exercised end-to-end
 * (login -> registration -> payment -> results) without external
 * dependencies. Each test file / server start gets a fresh store via
 * createStore(), which keeps unit tests isolated from one another.
 */

function createStore() {
  const students = new Map([
    [
      '02230123',
      {
        studentId: '02230123',
        password: 'Passw0rd1', // meets R4
        name: 'Pema Choden',
        programme: 'BSc Software Engineering',
        semester: 1,
        academicYear: '2026',
        tuitionPaid: true,
        drugTestVerified: true,
        registeredModules: ['SWE302', 'SWE303', 'SWS202'], // Pre-registered for demo
        payment: null, // { screenshot, transactionNumber, verified }
      },
    ],
    [
      '02230456',
      {
        studentId: '02230456',
        password: 'Secure99A',
        name: 'Tashi Wangmo',
        programme: 'BSc Computer Science',
        semester: 1,
        academicYear: '2026',
        tuitionPaid: false,
        drugTestVerified: false,
        registeredModules: [],
        payment: null,
      },
    ],
  ]);

  const modules = new Map([
    [
      'MAT205(SWE)',
      {
        code: 'MAT205(SWE)',
        title: 'MAT205(SWE) Repeater',
        description: 'Mathematics repeater course for Software Engineering students.',
        credits: 3,
        semester: 1,
        academicYear: '2026',
        lecturer: 'TBA',
        availableProgrammes: ['BSc Software Engineering'],
      },
    ],
    [
      'SWE302',
      {
        code: 'SWE302',
        title: 'Software Testing & Quality Assurance',
        description: 'Learn software testing methodologies, test automation, and quality assurance practices.',
        credits: 3,
        semester: 1,
        academicYear: '2026',
        lecturer: 'Dr. Karma Wangchuk',
        availableProgrammes: ['BSc Computer Science', 'BSc Software Engineering'],
      },
    ],
    [
      'SWE303',
      {
        code: 'SWE303',
        title: 'Software Project Management',
        description: 'Study software project management methodologies, agile practices, and team coordination.',
        credits: 3,
        semester: 1,
        academicYear: '2026',
        lecturer: 'Dr. Pema Lhamo',
        availableProgrammes: ['BSc Software Engineering'],
      },
    ],
    [
      'SWS202',
      {
        code: 'SWS202',
        title: 'Penetration Testing',
        description: 'Learn ethical hacking, vulnerability assessment, and security testing techniques.',
        credits: 3,
        semester: 1,
        academicYear: '2026',
        lecturer: 'Dr. Sonam Tshering',
        availableProgrammes: ['BSc Computer Science', 'BSc Software Engineering'],
      },
    ],
    [
      'WEB303',
      {
        code: 'WEB303',
        title: 'Microservices & Serverless Applications',
        description: 'Study microservices architecture, containerization, and serverless computing.',
        credits: 3,
        semester: 1,
        academicYear: '2026',
        lecturer: 'Ms. Dechen Wangmo',
        availableProgrammes: ['BSc Computer Science', 'BSc Software Engineering'],
      },
    ],
  ]);

  // Results are only visible for students who are registered for the module.
  // Sample demonstration data for test student 02230123
  const results = new Map([
    [
      '02230123',
      [
        {
          moduleCode: 'SWE302',
          moduleTitle: 'Software Testing & Quality Assurance',
          credits: 3,
          marks: 85,
          grade: 'A',
          gradePoints: 4.0,
          status: 'Passed',
        },
        {
          moduleCode: 'SWE303',
          moduleTitle: 'Software Project Management',
          credits: 3,
          marks: 78,
          grade: 'B+',
          gradePoints: 3.5,
          status: 'Passed',
        },
        {
          moduleCode: 'SWS202',
          moduleTitle: 'Penetration Testing',
          credits: 3,
          marks: null,
          grade: null,
          gradePoints: null,
          status: 'Result Pending',
        },
      ],
    ],
  ]);

  let registrationPeriodOpen = true;

  return {
    students,
    modules,
    results,
    getRegistrationPeriodOpen: () => registrationPeriodOpen,
    setRegistrationPeriodOpen: (val) => {
      registrationPeriodOpen = val;
    },
  };
}

module.exports = { createStore };
