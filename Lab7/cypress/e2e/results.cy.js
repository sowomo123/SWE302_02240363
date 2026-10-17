describe('Results Tests', () => {
  beforeEach(() => {
    cy.visit('/results.html');
  });

  it('should display results lookup form', () => {
    cy.get('[data-cy="student-id"]').should('be.visible');
    cy.get('[data-cy="view-results-btn"]').should('be.visible');
  });

  it('should display results for registered student', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.validStudent.studentId);
      cy.get('[data-cy="view-results-btn"]').click();
      
      cy.get('[data-cy="results-table"]').should('be.visible');
      cy.get('[data-cy="pdf-download"]').should('be.visible');
    });
  });

  it('should show Module Code, Title, and Grade in results table', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.validStudent.studentId);
      cy.get('[data-cy="view-results-btn"]').click();
      
      cy.get('[data-cy="results-table"]').should('be.visible');
      
      // Verify table headers
      cy.get('[data-cy="results-table"] th').should('contain', 'Module Code');
      cy.get('[data-cy="results-table"] th').should('contain', 'Module Title');
      cy.get('[data-cy="results-table"] th').should('contain', 'Grade');
      
      // Verify table has data rows
      cy.get('[data-cy="results-table"] tbody tr').should('have.length.greaterThan', 0);
    });
  });

  it('should show error for non-registered student', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.invalidStudent.studentId);
      cy.get('[data-cy="view-results-btn"]').click();
      
      cy.get('[data-cy="error"]').should('be.visible');
      cy.get('[data-cy="results-table"]').should('not.be.visible');
    });
  });

  it('should show error for invalid student ID format', () => {
    cy.get('[data-cy="student-id"]').type('123');
    cy.get('[data-cy="view-results-btn"]').click();
    
    cy.get('[data-cy="error"]').should('be.visible');
  });

  it('should display PDF download link when results are shown', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.validStudent.studentId);
      cy.get('[data-cy="view-results-btn"]').click();
      
      cy.get('[data-cy="pdf-download"]').should('be.visible');
      cy.get('[data-cy="pdf-download"]').should('contain', 'Download as PDF');
    });
  });

  it('should download PDF when download link is clicked', () => {
    cy.fixture('testData').then((data) => {
      cy.get('[data-cy="student-id"]').type(data.validStudent.studentId);
      cy.get('[data-cy="view-results-btn"]').click();
      
      cy.get('[data-cy="pdf-download"]').should('be.visible');
      
      // Click the PDF download link and verify it triggers a download
      cy.get('[data-cy="pdf-download"]').click();
      
      // Verify the PDF download was triggered (check for PDF in URL or response)
      cy.request(`/api/results/${data.validStudent.studentId}/pdf`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('application/pdf');
      });
    });
  });
});
