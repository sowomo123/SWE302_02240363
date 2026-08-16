(function () {
  const stored = localStorage.getItem('cst_student');
  if (stored) {
    try {
      document.getElementById('studentId').value = JSON.parse(stored).studentId;
    } catch (e) { /* ignore */ }
  }
})();

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertBox = document.getElementById('form-alert');
  const successBox = document.getElementById('form-success');
  alertBox.classList.remove('is-visible');
  successBox.classList.remove('is-visible');

  const studentId = document.getElementById('studentId').value.trim();
  const moduleCode = document.getElementById('moduleCode').value;

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, moduleCode }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      alertBox.textContent = data.message || 'Registration could not be completed.';
      alertBox.classList.add('is-visible');
      return;
    }

    successBox.textContent = data.message;
    successBox.classList.add('is-visible');
  } catch (err) {
    alertBox.textContent = 'Could not reach the server. Please try again.';
    alertBox.classList.add('is-visible');
  }
});
