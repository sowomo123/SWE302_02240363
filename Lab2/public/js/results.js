(function () {
  const stored = localStorage.getItem('cst_student');
  if (stored) {
    try {
      document.getElementById('studentId').value = JSON.parse(stored).studentId;
    } catch (e) { /* ignore */ }
  }
})();

document.getElementById('lookup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertBox = document.getElementById('form-alert');
  const table = document.getElementById('results-table');
  const body = document.getElementById('results-body');
  const pdfLink = document.getElementById('pdf-link');

  alertBox.classList.remove('is-visible');
  table.style.display = 'none';
  pdfLink.style.display = 'none';
  body.innerHTML = '';

  const studentId = document.getElementById('studentId').value.trim();

  try {
    const res = await fetch(`/api/results/${encodeURIComponent(studentId)}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      alertBox.textContent = data.message || 'Could not load results.';
      alertBox.classList.add('is-visible');
      return;
    }

    data.results.forEach((r) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.moduleCode}</td><td>${r.moduleTitle}</td><td class="grade">${r.grade}</td>`;
      body.appendChild(tr);
    });

    table.style.display = 'table';
    pdfLink.href = `/api/results/${encodeURIComponent(studentId)}/pdf`;
    pdfLink.style.display = 'inline-flex';
  } catch (err) {
    alertBox.textContent = 'Could not reach the server. Please try again.';
    alertBox.classList.add('is-visible');
  }
});
