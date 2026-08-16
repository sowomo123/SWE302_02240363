document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertBox = document.getElementById('form-alert');
  alertBox.classList.remove('is-visible');

  const studentId = document.getElementById('studentId').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, password }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      alertBox.textContent = data.message || 'Login failed.';
      alertBox.classList.add('is-visible');
      return;
    }

    localStorage.setItem('cst_student', JSON.stringify(data.student));
    window.location.href = 'register.html';
  } catch (err) {
    alertBox.textContent = 'Could not reach the server. Please try again.';
    alertBox.classList.add('is-visible');
  }
});
