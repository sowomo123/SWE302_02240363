/**
 * registrationDecision.test.js
 * -------------------------------------------------------------------------
 * Activity 3 — Decision Table Testing.
 * Exhaustively covers all 2^3 = 8 combinations of:
 *   Tuition Payment Verified? / Drug Testing Report Verified? /
 *   Registration Period Open?
 */

const { decideRegistration, MESSAGES } = require('../src/registrationDecision');

describe('Activity 3: Registration Decision Table (8 combinations)', () => {
  test.each([
    // payment, drugTest, period, expectedAllowed, expectedMessage
    [true, true, true, true, null],
    [true, true, false, false, MESSAGES.PERIOD],
    [true, false, true, false, MESSAGES.DRUG_TEST],
    [true, false, false, false, MESSAGES.DRUG_TEST],
    [false, true, true, false, MESSAGES.PAYMENT],
    [false, true, false, false, MESSAGES.PAYMENT],
    [false, false, true, false, MESSAGES.PAYMENT],
    [false, false, false, false, MESSAGES.PAYMENT],
  ])(
    'payment=%s drugTest=%s period=%s -> allowed=%s message=%s',
    (payment, drugTest, period, expectedAllowed, expectedMessage) => {
      const result = decideRegistration(payment, drugTest, period);
      expect(result.allowed).toBe(expectedAllowed);
      expect(result.message).toBe(expectedMessage);
    }
  );

  test('registration is allowed only when all three conditions are Y', () => {
    expect(decideRegistration(true, true, true).allowed).toBe(true);
  });

  test('tie-break order is Payment -> Drug Test -> Period when multiple fail', () => {
    // All three false: message should point to Payment (first in priority order).
    expect(decideRegistration(false, false, false).message).toBe(MESSAGES.PAYMENT);
    // Payment ok, other two false: message should point to Drug Test.
    expect(decideRegistration(true, false, false).message).toBe(MESSAGES.DRUG_TEST);
  });
});
