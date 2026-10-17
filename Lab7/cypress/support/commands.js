// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom login command for the CST College SMS

Cypress.Commands.add('login', (studentId, password) => {
  cy.visit('/login.html');

  cy.get('[data-cy="student-id"]').type(studentId);
  cy.get('[data-cy="password"]').type(password);
  cy.get('[data-cy="login-btn"]').click();
});


// Custom command to visit a page with login
Cypress.Commands.add('loginAndVisit', (studentId, password, page) => {
  cy.login(studentId, password);
  cy.visit(`http://localhost:3000/${page}`);
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })