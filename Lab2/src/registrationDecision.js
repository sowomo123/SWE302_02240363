/**
 * registrationDecision.js
 * -------------------------------------------------------------------------
 * Implements the decision table from Activity 3:
 *
 *   Conditions: Tuition Payment Verified? / Drug Testing Report Verified? /
 *               Registration Period Open?
 *   Actions:    Registration Allowed  |  Registration Rejected - message
 *
 * Tie-break order when more than one condition fails:
 *   Payment -> Drug Testing Report -> Registration Period
 */

const MESSAGES = {
  PAYMENT: 'Tuition payment not verified.',
  DRUG_TEST: 'Drug testing report not verified.',
  PERIOD: 'Registration period is closed.',
};

/**
 * @param {boolean} paymentVerified
 * @param {boolean} drugTestVerified
 * @param {boolean} periodOpen
 * @returns {{ allowed: boolean, message: string|null }}
 */
function decideRegistration(paymentVerified, drugTestVerified, periodOpen) {
  if (!paymentVerified) {
    return { allowed: false, message: MESSAGES.PAYMENT };
  }
  if (!drugTestVerified) {
    return { allowed: false, message: MESSAGES.DRUG_TEST };
  }
  if (!periodOpen) {
    return { allowed: false, message: MESSAGES.PERIOD };
  }
  return { allowed: true, message: null };
}

module.exports = { decideRegistration, MESSAGES };
