/**
 * validators.test.js
 * -------------------------------------------------------------------------
 * Activity 1 (Equivalence Partitioning) and Activity 2 (Boundary Value
 * Analysis) automated as Jest tests against src/validators.js.
 */

const {
  validateStudentId,
  validatePassword,
  validatePaymentScreenshot,
  validateTransactionNumber,
} = require('../src/validators');

// ===========================================================================
// Activity 1 — Equivalence Partitioning
// ===========================================================================
describe('Activity 1: Equivalence Partitioning', () => {
  describe('Student ID (R1, R2)', () => {
    test.each([
      ['02230123', true, 'exactly 8 digits, numeric only'],
      ['2230123', false, 'only 7 digits (too short)'],
      ['0223ABCD', false, 'contains letters'],
      ['022301234', false, '9 digits (too long)'],
      ['', false, 'missing / empty student ID'],
      [undefined, false, 'missing student ID (undefined)'],
      ['0223-123', false, 'contains a non-digit special character'],
    ])('%s -> valid=%s (%s)', (input, expected) => {
      expect(validateStudentId(input).valid).toBe(expected);
    });
  });

  describe('Password (R3, R4)', () => {
    test.each([
      ['Passw0rd1', true, 'valid: 9 chars, upper+lower+number'],
      ['Ab1defgh', true, 'valid: exactly 8 chars, meets all rules'],
      ['Abcdefghijk1', true, 'valid: exactly 12 chars, meets all rules'],
      ['Ab1defg', false, 'too short (7 chars)'],
      ['Abcdefghijk12', false, 'too long (13 chars)'],
      ['abcdefg1', false, 'missing uppercase letter'],
      ['ABCDEFG1', false, 'missing lowercase letter'],
      ['Abcdefgh', false, 'missing number'],
      ['', false, 'missing / empty password'],
      [undefined, false, 'missing password (undefined)'],
    ])('%s -> valid=%s (%s)', (input, expected) => {
      expect(validatePassword(input).valid).toBe(expected);
    });
  });

  describe('Payment Screenshot (R6)', () => {
    test.each([
      ['receipt.jpg', true, 'valid .jpg extension'],
      ['receipt.jpeg', true, 'valid .jpeg extension'],
      ['receipt.png', true, 'valid .png extension'],
      ['receipt.pdf', false, 'invalid extension (.pdf)'],
      ['receipt.gif', false, 'invalid extension (.gif)'],
      ['receipt', false, 'no extension at all'],
      [null, false, 'no file uploaded / missing'],
      ['', false, 'empty filename'],
      ['RECEIPT.PNG', true, 'valid extension, case-insensitive'],
    ])('%s -> valid=%s (%s)', (input, expected) => {
      expect(validatePaymentScreenshot(input).valid).toBe(expected);
    });
  });

  describe('Transaction Number (R7)', () => {
    test.each([
      ['123-123456789', true, 'valid: 3 digits, hyphen, 9 digits (13 chars)'],
      ['12-123456789', false, 'invalid: only 2 digits before hyphen'],
      ['123-12345678', false, 'invalid: only 8 digits after hyphen'],
      ['1234123456789', false, 'invalid: missing hyphen entirely'],
      ['ABC-123456789', false, 'invalid: letters instead of digits before hyphen'],
      ['', false, 'missing / empty transaction number'],
      [undefined, false, 'missing transaction number (undefined)'],
      ['123-1234567890', false, 'invalid: 10 digits after hyphen (too long)'],
    ])('%s -> valid=%s (%s)', (input, expected) => {
      expect(validateTransactionNumber(input).valid).toBe(expected);
    });
  });
});

// ===========================================================================
// Activity 2 — Boundary Value Analysis
// ===========================================================================
describe('Activity 2: Boundary Value Analysis', () => {
  describe('Student ID length boundaries (R2 — exactly 8 digits)', () => {
    test('7 digits is invalid (below boundary)', () => {
      expect(validateStudentId('1234567').valid).toBe(false);
    });
    test('8 digits is valid (on boundary)', () => {
      expect(validateStudentId('12345678').valid).toBe(true);
    });
    test('9 digits is invalid (above boundary)', () => {
      expect(validateStudentId('123456789').valid).toBe(false);
    });
  });

  describe('Password length boundaries (R4 — 8 to 12 characters)', () => {
    // Each candidate below satisfies upper/lower/number so length is the only variable.
    test('7 characters is invalid (below lower boundary)', () => {
      expect(validatePassword('Ab1defg').valid).toBe(false); // 7 chars
    });
    test('8 characters is valid (on lower boundary)', () => {
      expect(validatePassword('Ab1defgh').valid).toBe(true); // 8 chars
    });
    test('9 characters is valid (just above lower boundary)', () => {
      expect(validatePassword('Ab1defghi').valid).toBe(true); // 9 chars
    });
    test('11 characters is valid (just below upper boundary)', () => {
      expect(validatePassword('Ab1defghijk').valid).toBe(true); // 11 chars
    });
    test('12 characters is valid (on upper boundary)', () => {
      expect(validatePassword('Ab1defghijkl').valid).toBe(true); // 12 chars
    });
    test('13 characters is invalid (above upper boundary)', () => {
      expect(validatePassword('Ab1defghijklm').valid).toBe(false); // 13 chars
    });
  });

  describe('Transaction Number length/format boundaries (R7 — 13-char fixed format)', () => {
    test('12 characters, one digit short, is invalid', () => {
      expect(validateTransactionNumber('123-12345678').valid).toBe(false); // 12 chars
    });
    test('13 characters in the correct DDD-DDDDDDDDD pattern is valid', () => {
      expect(validateTransactionNumber('123-123456789').valid).toBe(true); // 13 chars
    });
    test('14 characters, one digit too many, is invalid', () => {
      expect(validateTransactionNumber('123-1234567890').valid).toBe(false); // 14 chars
    });

    // Assumption stated per the lab instructions: letters and extra hyphens
    // are NOT allowed anywhere in the transaction number, even if the total
    // length happens to be 13 characters.
    test('assumption: 13 chars with a letter substituted is still invalid', () => {
      expect(validateTransactionNumber('12A-123456789').valid).toBe(false);
    });
    test('assumption: 13 chars with hyphen moved is still invalid', () => {
      expect(validateTransactionNumber('1231-23456789').valid).toBe(false);
    });
  });

  describe('Payment Screenshot — Not Applicable for BVA (R6)', () => {
    test('documented as N/A: R6 defines allowed file types, not a numeric/length range', () => {
      // Equivalence Partitioning (above) is the correct technique for this field.
      expect(true).toBe(true);
    });
  });
});
