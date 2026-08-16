(function () {
  const actions = document.getElementById('header-actions');
  if (!actions) return;

  const raw = localStorage.getItem('cst_student');
  if (!raw) return;

  try {
    const student = JSON.parse(raw);
    actions.innerHTML = `
      <span style="color:#d8dbe6;font-size:0.86rem;">Hi, ${student.name || student.studentId}</span>
      <button id="logout-btn" class="btn btn--ghost-light">Log Out</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('cst_student');
      window.location.href = 'index.html';
    });
  } catch (e) {
    // ignore malformed local storage
  }
})();
