
describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('/login.html');
  });

  it('should reject a 7-digit Student ID', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type('0223012');

      cy.get('[data-cy="password"]')
        .type(data.validStudent.password);

      cy.get('[data-cy="login-btn"]').click();

      cy.get('[data-cy="error"]')
        .should('be.visible')
        .and('not.be.empty');
    });
  });

  it('should reject Student ID with letters', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type('0223012A');

      cy.get('[data-cy="password"]')
        .type(data.validStudent.password);

      cy.get('[data-cy="login-btn"]').click();

      cy.get('[data-cy="error"]')
        .should('be.visible')
        .and('not.be.empty');
    });
  });

  it('should reject empty Student ID', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="password"]')
        .type(data.validStudent.password);

      cy.get('[data-cy="login-btn"]').click();

      cy.get('[data-cy="error"]')
        .should('be.visible')
        .and('not.be.empty');
    });
  });

  it('should reject empty password', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.validStudent.studentId);

      cy.get('[data-cy="login-btn"]').click();

      cy.get('[data-cy="error"]')
        .should('be.visible')
        .and('not.be.empty');
    });
  });

  it('should reject both empty fields', () => {
    cy.get('[data-cy="login-btn"]').click();

    cy.get('[data-cy="error"]')
      .should('be.visible')
      .and('not.be.empty');
  });

  it('should reject wrong password', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.validStudent.studentId);
      cy.get('[data-cy="password"]').type('WrongPass1');

      cy.get('[data-cy="login-btn"]').click();

      cy.get('[data-cy="error"]')
        .should('be.visible')
        .and('not.be.empty');
    });
  });

  it('should reject non-existent Student ID', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.invalidStudent.studentId);
      cy.get('[data-cy="password"]').type(data.validStudent.password);

      cy.get('[data-cy="login-btn"]').click();

      cy.get('[data-cy="error"]')
        .should('be.visible')
        .and('not.be.empty');
    });
  });

  it('should login successfully with valid credentials', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.validStudent.studentId);
      cy.get('[data-cy="password"]').type(data.validStudent.password);

      cy.get('[data-cy="login-btn"]').click();

      cy.get('[data-cy="error"]').should('not.be.visible');
      cy.url().should('include', '/register.html');
    });
  });
});
