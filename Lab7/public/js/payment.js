(function () {
  const stored = localStorage.getItem('cst_student');
  if (stored) {
    try {
      document.getElementById('studentId').value = JSON.parse(stored).studentId;
    } catch (e) { /* ignore */ }
  }
})();

document.getElementById('payment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alertBox = document.getElementById('form-alert');
  const successBox = document.getElementById('form-success');
  alertBox.classList.remove('is-visible');
  successBox.classList.remove('is-visible');

  const studentId = document.getElementById('studentId').value.trim();
  const transactionNumber = document.getElementById('transactionNumber').value.trim();
  const fileInput = document.getElementById('screenshot');

  const formData = new FormData();
  formData.append('studentId', studentId);
  formData.append('transactionNumber', transactionNumber);
  if (fileInput.files[0]) {
    formData.append('screenshot', fileInput.files[0]);
  }

  try {
    const res = await fetch('/api/payment', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok || !data.success) {
      const details = data.errors ? data.errors.join(' ') : data.message;
      alertBox.textContent = details || 'Payment could not be verified.';
      alertBox.classList.add('is-visible');
      return;
    }

    successBox.textContent = `${data.message} Receipt: ${data.receipt.receiptNumber}`;
    successBox.classList.add('is-visible');
  } catch (err) {
    alertBox.textContent = 'Could not reach the server. Please try again.';
    alertBox.classList.add('is-visible');
  }
});
