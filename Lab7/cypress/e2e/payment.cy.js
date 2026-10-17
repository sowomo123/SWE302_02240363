describe('Payment Tests', () => {
  beforeEach(() => {
    cy.visit('/payment.html');
  });

  it('should submit payment with valid screenshot and transaction number', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.payment.studentId);
      cy.get('[data-cy="transaction-number"]').type(data.payment.transactionNumber);

      // Create a test JPG file for upload
      const fileName = 'payment.jpg';
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[data-cy="screenshot"]').selectFile({
          contents: Cypress.Buffer.from(fileContent, 'base64'),
          fileName: fileName,
          mimeType: 'image/jpeg'
        });
      });

      cy.get('[data-cy="submit-btn"]').click();

      cy.get('[data-cy="success"]').should('be.visible');
    });
  });

  it('should reject non-image file (PDF)', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.payment.studentId);
      cy.get('[data-cy="transaction-number"]').type(data.payment.transactionNumber);

      // Create a test PDF file for upload
      const fileName = 'document.pdf';
      const fileContent = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmogICUgcGFnZXMgY2F0YWxvZwo8PAogIC9UeXBlIC9QYWdlcwogIC9NZWRpYUJveCBbIDAgMCA1MDAgNTAwIF0KICAvQ291bnQgMQogIC9LaWRzIFsgMyAwIFIgXQo+PgplbmRvYmoKCjMgMCBvYmogICUgcGFnZQo8PAogIC9UeXBlIC9QYWdlCiAgL1BhcmVudCAyIDAgUgogIC9SZXNvdXJjZXMgPDwKICAgIC9Gb250IDw8CiAgICAgIC9GMSA0IDAgUgogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmogICUgZm9udAo8PAogIC9UeXBlIC9Gb250CiAgL1N1YnR5cGUgL1R5cGUxCiAgL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIFdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAgCjAwMDAwMDAxNTcgMDAwMDAgbiAgCjAwMDAwMDAyNjAgMDAwMDAgbiAgCjAwMDAwMDAzNTcgMDAwMDAgbiAgCnRyYWlsZXIKPDwKICAvU2l6ZSA2CiAgL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ1NAolJUVPRgo=';
      cy.get('[data-cy="screenshot"]').selectFile({
        contents: Cypress.Buffer.from(fileContent, 'base64'),
        fileName: fileName,
        mimeType: 'application/pdf'
      });

      cy.get('[data-cy="submit-btn"]').click();

      cy.get('[data-cy="error"]').should('be.visible');
    });
  });

  it('should reject invalid transaction number format (missing hyphen)', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.payment.studentId);
      cy.get('[data-cy="transaction-number"]').type('123456789');

      const fileName = 'payment.jpg';
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[data-cy="screenshot"]').selectFile({
          contents: Cypress.Buffer.from(fileContent, 'base64'),
          fileName: fileName,
          mimeType: 'image/jpeg'
        });
      });

      cy.get('[data-cy="submit-btn"]').click();

      cy.get('[data-cy="error"]').should('be.visible');
    });
  });

  it('should reject invalid transaction number format (wrong pattern)', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.payment.studentId);
      cy.get('[data-cy="transaction-number"]').type('invalid-format');

      const fileName = 'payment.jpg';
      cy.fixture(fileName, 'base64').then((fileContent) => {
        cy.get('[data-cy="screenshot"]').selectFile({
          contents: Cypress.Buffer.from(fileContent, 'base64'),
          fileName: fileName,
          mimeType: 'image/jpeg'
        });
      });

      cy.get('[data-cy="submit-btn"]').click();

      cy.get('[data-cy="error"]').should('be.visible');
    });
  });
});
