/**
 * validators.js
 * -------------------------------------------------------------------------
 * Implements the field-level validation rules from Part A of the SRS.
 * Every function returns { valid: boolean, reason: string }, which makes
 * the equivalence classes from Activity 1 directly testable: each class
 * is simply a call to one of these functions with a representative input.
 *
 *   R1/R2 -> validateStudentId
 *   R3/R4 -> validatePassword
 *   R6    -> validatePaymentScreenshot
 *   R7    -> validateTransactionNumber
 */

// R1: Student ID is mandatory. R2: exactly 8 digits, numeric only.
function validateStudentId(studentId) {
  if (studentId === undefined || studentId === null || studentId === '') {
    return { valid: false, reason: 'Student ID is required (R1).' };
  }
  if (typeof studentId !== 'string') {
    return { valid: false, reason: 'Student ID must be a string.' };
  }
  if (!/^\d+$/.test(studentId)) {
    return { valid: false, reason: 'Student ID must contain digits only (R2).' };
  }
  if (studentId.length !== 8) {
    return {
      valid: false,
      reason: `Student ID must be exactly 8 digits, got ${studentId.length} (R2).`,
    };
  }
  return { valid: true, reason: 'Valid: exactly 8 digits, numeric only.' };
}

// R3: Password is mandatory.
// R4: 8-12 characters, at least one uppercase, one lowercase, one number.
function validatePassword(password) {
  if (password === undefined || password === null || password === '') {
    return { valid: false, reason: 'Password is required (R3).' };
  }
  if (typeof password !== 'string') {
    return { valid: false, reason: 'Password must be a string.' };
  }
  if (password.length < 8) {
    return { valid: false, reason: `Password too short (${password.length} chars, min 8) (R4).` };
  }
  if (password.length > 12) {
    return { valid: false, reason: `Password too long (${password.length} chars, max 12) (R4).` };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must include at least one uppercase letter (R4).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must include at least one lowercase letter (R4).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must include at least one number (R4).' };
  }
  return { valid: true, reason: 'Valid: 8-12 chars with upper, lower, and number.' };
}

// R6: payment screenshot mandatory, must be JPG, JPEG, or PNG.
const ALLOWED_SCREENSHOT_TYPES = ['jpg', 'jpeg', 'png'];

function validatePaymentScreenshot(filename) {
  if (!filename) {
    return { valid: false, reason: 'Payment screenshot is required (R6).' };
  }
  const parts = filename.split('.');
  if (parts.length < 2) {
    return { valid: false, reason: 'File has no extension; cannot verify type (R6).' };
  }
  const ext = parts.pop().toLowerCase();
  if (!ALLOWED_SCREENSHOT_TYPES.includes(ext)) {
    return { valid: false, reason: `File type ".${ext}" is not allowed. Use JPG, JPEG, or PNG (R6).` };
  }
  return { valid: true, reason: 'Valid: accepted image file type.' };
}

// R7: transaction number = 3 digits, hyphen, 9 digits (13 chars total).
const TRANSACTION_NUMBER_REGEX = /^\d{3}-\d{9}$/;

function validateTransactionNumber(transactionNumber) {
  if (transactionNumber === undefined || transactionNumber === null || transactionNumber === '') {
    return { valid: false, reason: 'Transaction number is required (R7).' };
  }
  if (typeof transactionNumber !== 'string') {
    return { valid: false, reason: 'Transaction number must be a string.' };
  }
  if (!TRANSACTION_NUMBER_REGEX.test(transactionNumber)) {
    return {
      valid: false,
      reason: 'Transaction number must match format DDD-DDDDDDDDD (3 digits, hyphen, 9 digits) (R7).',
    };
  }
  return { valid: true, reason: 'Valid: matches 3-digit-hyphen-9-digit format.' };
}

module.exports = {
  validateStudentId,
  validatePassword,
  validatePaymentScreenshot,
  validateTransactionNumber,
  ALLOWED_SCREENSHOT_TYPES,
  TRANSACTION_NUMBER_REGEX,
};
