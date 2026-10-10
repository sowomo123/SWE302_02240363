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
  const studentInfo = document.getElementById('student-info');

  alertBox.classList.remove('is-visible');
  table.style.display = 'none';
  pdfLink.style.display = 'none';
  studentInfo.style.display = 'none';
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

    // Display student information
    if (data.student) {
      studentInfo.innerHTML = `
        <div class="student-info-header">
          <div class="student-info-header__field">Student:</div>
          <div class="student-info-header__value">${data.student.name} (${data.student.studentId})</div>
          <div class="student-info-header__field">Semester:</div>
          <div class="student-info-header__value">${data.student.semester}</div>
          <div class="student-info-header__field">Academic Year:</div>
          <div class="student-info-header__value">${data.student.academicYear}</div>
        </div>
      `;
      studentInfo.style.display = 'block';
    }

    // Display results with enhanced information
    data.results.forEach((r) => {
      const tr = document.createElement('tr');
      const marks = r.marks !== null ? r.marks : 'Pending';
      const grade = r.grade !== null ? r.grade : 'Pending';
      const gradePoints = r.gradePoints !== null ? r.gradePoints : '-';
      const statusClass = r.status === 'Result Pending' ? 'status-pending' : 'status-passed';
      
      tr.innerHTML = `
        <td>${r.moduleCode}</td>
        <td>${r.moduleTitle}</td>
        <td>${r.credits}</td>
        <td>${marks}</td>
        <td class="grade">${grade}</td>
        <td>${gradePoints}</td>
        <td><span class="result-status ${statusClass}">${r.status}</span></td>
      `;
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
