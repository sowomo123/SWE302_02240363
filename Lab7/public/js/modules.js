(function () {
  const stored = localStorage.getItem('cst_student');
  let currentStudent = null;
  let selectedModuleCode = null;

  if (stored) {
    try {
      currentStudent = JSON.parse(stored);
      loadStudentData(currentStudent.studentId);
    } catch (e) {
      console.error('Error parsing student data:', e);
    }
  }

  // Load student information
  async function loadStudentData(studentId) {
    try {
      const res = await fetch(`/api/students/${studentId}`);
      const data = await res.json();

      if (data.success) {
        const student = data.student;
        document.getElementById('student-info').style.display = 'block';
        document.getElementById('info-studentId').textContent = student.studentId;
        document.getElementById('info-name').textContent = student.name;
        document.getElementById('info-programme').textContent = student.programme;
        document.getElementById('info-semester').textContent = student.semester;
        document.getElementById('info-academicYear').textContent = student.academicYear;

        // Update current student with latest data
        currentStudent = { ...currentStudent, ...student };

        // Display registered modules
        if (student.registeredModulesDetails && student.registeredModulesDetails.length > 0) {
          displayRegisteredModules(student.registeredModulesDetails);
        }
      }
    } catch (err) {
      console.error('Error loading student data:', err);
    }
  }

  // Display registered modules
  function displayRegisteredModules(modules) {
    const section = document.getElementById('registered-section');
    const grid = document.getElementById('registered-modules-grid');
    
    section.style.display = 'block';
    grid.innerHTML = modules.map((mod) => `
      <div class="module-card module-card--registered">
        <div class="module-card__code">${mod.code}</div>
        <div class="module-card__title">${mod.title}</div>
        <div class="module-card__credits">${mod.credits} Credits</div>
        <div class="module-card__status module-card__status--registered">Registered</div>
      </div>
    `).join('');
  }

  // Load all modules
  async function loadModules() {
    try {
      const res = await fetch('/api/modules');
      const data = await res.json();

      if (data.success) {
        displayModules(data.modules);
      } else {
        showError('Failed to load modules.');
      }
    } catch (err) {
      showError('Could not reach the server. Please try again.');
    }
  }

  // Display modules in grid
  function displayModules(modules) {
    const grid = document.getElementById('modules-grid');
    
    if (!currentStudent) {
      grid.innerHTML = '<p class="error">Please <a href="login.html">log in</a> to view available modules.</p>';
      return;
    }

    const filteredModules = modules.filter(
      (mod) => mod.availableProgrammes.includes(currentStudent.programme) && mod.semester === currentStudent.semester
    );

    if (filteredModules.length === 0) {
      grid.innerHTML = '<p class="info">No modules available for your programme and semester.</p>';
      return;
    }

    grid.innerHTML = filteredModules.map((mod) => {
      const isRegistered = currentStudent.registeredModules && currentStudent.registeredModules.includes(mod.code);
      const isAvailable = mod.availableProgrammes.includes(currentStudent.programme) && mod.semester === currentStudent.semester;
      
      return `
        <div class="module-card ${isRegistered ? 'module-card--registered' : ''} ${!isAvailable ? 'module-card--unavailable' : ''}">
          <div class="module-card__header">
            <div class="module-card__code">${mod.code}</div>
            <div class="module-card__credits">${mod.credits} Credits</div>
          </div>
          <div class="module-card__title">${mod.title}</div>
          <div class="module-card__description">${mod.description}</div>
          <div class="module-card__meta">
            <span class="module-card__meta-item">Semester ${mod.semester}</span>
            <span class="module-card__meta-item">${mod.academicYear}</span>
          </div>
          <div class="module-card__lecturer">${mod.lecturer}</div>
          <div class="module-card__footer">
            ${isRegistered 
              ? '<span class="module-card__status module-card__status--registered">Registered</span>'
              : isAvailable
                ? `<button class="btn btn--gold btn--sm" onclick="window.registerModule('${mod.code}')">Register</button>`
                : '<span class="module-card__status module-card__status--unavailable">Not Available</span>'
            }
          </div>
        </div>
      `;
    }).join('');
  }

  // Show error message
  function showError(message) {
    const alertBox = document.getElementById('alert-error');
    alertBox.textContent = message;
    alertBox.classList.add('is-visible');
    setTimeout(() => alertBox.classList.remove('is-visible'), 5000);
  }

  // Show success message
  function showSuccess(message) {
    const alertBox = document.getElementById('alert-success');
    alertBox.textContent = message;
    alertBox.classList.add('is-visible');
    setTimeout(() => alertBox.classList.remove('is-visible'), 5000);
  }

  // Register module function (exposed globally)
  window.registerModule = function (moduleCode) {
    if (!currentStudent) {
      showError('Please log in to register for modules.');
      window.location.href = 'login.html';
      return;
    }

    selectedModuleCode = moduleCode;
    const module = Array.from(document.querySelectorAll('.module-card')).find((card) => 
      card.querySelector('.module-card__code').textContent === moduleCode
    );

    if (module) {
      const title = module.querySelector('.module-card__title').textContent;
      document.getElementById('confirm-module-code').textContent = moduleCode;
      document.getElementById('confirm-module-title').textContent = title;
      document.getElementById('confirm-modal').style.display = 'flex';
    }
  };

  // Modal event handlers
  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('confirm-modal').style.display = 'none';
    selectedModuleCode = null;
  });

  document.getElementById('modal-cancel').addEventListener('click', () => {
    document.getElementById('confirm-modal').style.display = 'none';
    selectedModuleCode = null;
  });

  document.getElementById('modal-confirm').addEventListener('click', async () => {
    if (!selectedModuleCode || !currentStudent) return;

    const modal = document.getElementById('confirm-modal');
    modal.style.display = 'none';

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: currentStudent.studentId, moduleCode: selectedModuleCode }),
      });
      const data = await res.json();

      if (data.success) {
        showSuccess(data.message);
        // Refresh student data and modules
        await loadStudentData(currentStudent.studentId);
        await loadModules();
      } else {
        showError(data.message || 'Registration could not be completed.');
      }
    } catch (err) {
      showError('Could not reach the server. Please try again.');
    }

    selectedModuleCode = null;
  });

  // Close modal on overlay click
  document.getElementById('confirm-modal').addEventListener('click', (e) => {
    if (e.target.id === 'confirm-modal') {
      document.getElementById('confirm-modal').style.display = 'none';
      selectedModuleCode = null;
    }
  });

  // Initial load
  loadModules();
})();
