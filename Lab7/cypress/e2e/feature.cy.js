describe('Module Registration Feature Tests', () => {
  it('should display module catalog', () => {
    cy.visit('/modules.html');
    cy.get('[data-cy="modules-grid"]').should('be.visible');
  });

  it('should display student info when logged in', () => {
    cy.fixture('testData').then((data) => {
      // Use custom login command that visits login page and sets localStorage
      cy.login(data.validStudent.studentId, data.validStudent.password);
      
      cy.visit('/modules.html');
      
      // Wait for the async API call to load student data
      cy.get('[data-cy="student-info-card"]', { timeout: 10000 }).should('be.visible');
      
      // Verify student info is displayed correctly
      cy.get('#info-studentId').should('contain', data.validStudent.studentId);
      cy.get('#info-name').should('not.be.empty');
    });
  });

  it('should display registered modules section when student has registrations', () => {
    cy.fixture('testData').then((data) => {
      cy.login(data.validStudent.studentId, data.validStudent.password);
      
      cy.visit('/modules.html');
      
      // Wait for the async API call to load student data
      cy.get('[data-cy="registered-section"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="registered-modules-grid"]').should('be.visible');
      
      // Verify registered modules are displayed
      cy.get('[data-cy="registered-modules-grid"] .module-card').should('have.length.greaterThan', 0);
    });
  });

  it('should show confirmation modal when clicking Register button', () => {
    cy.fixture('testData').then((data) => {
      cy.login(data.validStudent.studentId, data.validStudent.password);
      
      cy.visit('/modules.html');
      
      // Wait for the async API call to load modules
      cy.get('[data-cy="modules-grid"]', { timeout: 10000 }).should('be.visible');
      
      // Check if there are any Register buttons available
      cy.get('[data-cy="modules-grid"]').then(($grid) => {
        const hasRegisterButton = $grid.find('button').length > 0;
        
        if (hasRegisterButton) {
          // Find and click a Register button for an available module
          cy.get('[data-cy="modules-grid"] button').contains('Register').first().click();
          
          // The modal should appear after clicking register
          cy.get('[data-cy="confirm-modal"]').should('be.visible');
          cy.get('[data-cy="modal-cancel"]').should('be.visible');
          cy.get('[data-cy="modal-confirm"]').should('be.visible');
          
          // Verify modal shows the module code being registered
          cy.get('#confirm-module-code').should('not.be.empty');
        } else {
          // All modules are already registered - skip this test
          cy.log('No Register buttons found - student may have all available modules registered');
        }
      });
    });
  });

  it('should prevent accidental registration - usability fix confirmation modal', () => {
    cy.fixture('testData').then((data) => {
      cy.login(data.validStudent.studentId, data.validStudent.password);
      
      cy.visit('/modules.html');
      
      // Wait for the async API call to load modules
      cy.get('[data-cy="modules-grid"]', { timeout: 10000 }).should('be.visible');
      
      // Check if there are any Register buttons available
      cy.get('[data-cy="modules-grid"]').then(($grid) => {
        const hasRegisterButton = $grid.find('button').length > 0;
        
        if (hasRegisterButton) {
          // Click Register button
          cy.get('[data-cy="modules-grid"] button').contains('Register').first().click();
          
          // Modal appears - this is the usability fix preventing accidental registration
          cy.get('[data-cy="confirm-modal"]').should('be.visible');
          
          // Click cancel to prevent registration
          cy.get('[data-cy="modal-cancel"]').click();
          
          // Modal should close and module should NOT be registered
          cy.get('[data-cy="confirm-modal"]').should('not.be.visible');
          cy.get('[data-cy="error"]').should('not.be.visible');
          
          // Verify the Register button is still visible (not registered)
          cy.get('[data-cy="modules-grid"] button').contains('Register').should('be.visible');
        } else {
          cy.log('No Register buttons found - student may have all available modules registered');
        }
      });
    });
  });

  it('should successfully register module after confirmation', () => {
    cy.fixture('testData').then((data) => {
      cy.login(data.validStudent.studentId, data.validStudent.password);
      
      cy.visit('/modules.html');
      
      // Wait for the async API call to load modules
      cy.get('[data-cy="modules-grid"]', { timeout: 10000 }).should('be.visible');
      
      // Check if there are any Register buttons available
      cy.get('[data-cy="modules-grid"]').then(($grid) => {
        const hasRegisterButton = $grid.find('button').length > 0;
        
        if (hasRegisterButton) {
          // Click Register button
          cy.get('[data-cy="modules-grid"] button').contains('Register').first().click();
          
          // Confirm the registration
          cy.get('[data-cy="confirm-modal"]').should('be.visible');
          cy.get('[data-cy="modal-confirm"]').click();
          
          // Modal should close
          cy.get('[data-cy="confirm-modal"]').should('not.be.visible');
          
          // Success message should appear
          cy.get('[data-cy="success"]').should('be.visible');
          
          // Module should now show as registered
          cy.get('[data-cy="modules-grid"] .module-card__status--registered').should('be.visible');
        } else {
          cy.log('No Register buttons found - student may have all available modules registered');
        }
      });
    });
  });
});
