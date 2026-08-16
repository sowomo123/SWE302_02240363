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
        tuitionPaid: true,
        drugTestVerified: true,
        registeredModules: [],
        payment: null, // { screenshot, transactionNumber, verified }
      },
    ],
    [
      '02230456',
      {
        studentId: '02230456',
        password: 'Secure99A',
        name: 'Tashi Wangmo',
        tuitionPaid: false,
        drugTestVerified: false,
        registeredModules: [],
        payment: null,
      },
    ],
  ]);

  const modules = new Map([
    ['SWE302', { code: 'SWE302', title: 'Software Testing & Quality Assurance' }],
    ['CSC201', { code: 'CSC201', title: 'Data Structures & Algorithms' }],
  ]);

  // Results are only visible for students who are registered for the module.
  const results = new Map([
    ['02230123', [{ moduleCode: 'SWE302', moduleTitle: 'Software Testing & Quality Assurance', grade: 'A' }]],
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
