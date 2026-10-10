/**
 * api.test.js
 * -------------------------------------------------------------------------
 * Activity 4 — Test Case Design.
 * 15+ end-to-end test cases against the running Express app (via supertest),
 * covering: valid/invalid/missing inputs, boundary values, Student ID,
 * Password, Payment Screenshot upload + file type, Transaction Number,
 * payment verification (R8/R9), drug testing report verification, duplicate
 * module registration, registration conditions (decision table), and result
 * viewing conditions.
 *
 * A fresh store + app is created before every test so test cases never leak
 * state into one another (e.g. registering a module in one test cannot
 * affect the "duplicate registration" test).
 */

const request = require('supertest');
const { createApp } = require('../src/app');
const { createStore } = require('../src/store');

let app;
let store;

beforeEach(() => {
  store = createStore();
  app = createApp(store);
});

describe('Activity 4: Test Case Design (Section 1 — Login)', () => {
  // TC01 - R2 - valid Student ID + valid password -> login succeeds
  test('TC01: valid Student ID and password logs in successfully', async () => {
    const res = await request(app).post('/api/login').send({ studentId: '02230123', password: 'Passw0rd1' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // TC02 - R2 - invalid Student ID (too short) is rejected before checking credentials
  test('TC02: Student ID with only 7 digits is rejected', async () => {
    const res = await request(app).post('/api/login').send({ studentId: '2230123', password: 'Passw0rd1' });
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('studentId');
  });

  // TC03 - R1 - missing Student ID
  test('TC03: missing Student ID returns a validation error', async () => {
    const res = await request(app).post('/api/login').send({ password: 'Passw0rd1' });
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('studentId');
  });

  // TC04 - R4 - password missing uppercase letter is rejected
  test('TC04: password missing an uppercase letter is rejected', async () => {
    const res = await request(app).post('/api/login').send({ studentId: '02230123', password: 'passw0rd1' });
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('password');
  });

  // TC05 - R3 - missing password
  test('TC05: missing password returns a validation error', async () => {
    const res = await request(app).post('/api/login').send({ studentId: '02230123' });
    expect(res.status).toBe(400);
    expect(res.body.field).toBe('password');
  });

  // TC06 - correct format but wrong credentials -> 401, not a validation error
  test('TC06: well-formed but incorrect credentials return 401 Unauthorized', async () => {
    const res = await request(app).post('/api/login').send({ studentId: '02230123', password: 'WrongPass1' });
    expect(res.status).toBe(401);
  });
});

describe('Activity 4: Test Case Design (Section 3 — Tuition Payment)', () => {
  // TC07 - R6/R7 - valid screenshot type + valid transaction number -> verified, receipt issued (R8)
  test('TC07: valid screenshot and transaction number generates a receipt', async () => {
    const res = await request(app)
      .post('/api/payment')
      .field('studentId', '02230456')
      .field('transactionNumber', '123-123456789')
      .attach('screenshot', Buffer.from('fake-image-bytes'), 'proof.png');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.receipt).toBeDefined();
  });

  // TC08 - R6 - disallowed file type (.pdf) is rejected, registration stays incomplete (R9)
  test('TC08: disallowed screenshot file type (.pdf) is rejected', async () => {
    const res = await request(app)
      .post('/api/payment')
      .field('studentId', '02230456')
      .field('transactionNumber', '123-123456789')
      .attach('screenshot', Buffer.from('fake-pdf-bytes'), 'proof.pdf');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // TC09 - R7 - malformed transaction number is rejected even with a valid screenshot
  test('TC09: malformed transaction number is rejected', async () => {
    const res = await request(app)
      .post('/api/payment')
      .field('studentId', '02230456')
      .field('transactionNumber', '12-123456789')
      .attach('screenshot', Buffer.from('fake-image-bytes'), 'proof.jpg');
    expect(res.status).toBe(400);
  });

  // TC10 - R9 - missing screenshot entirely leaves registration incomplete
  test('TC10: missing payment screenshot leaves the payment unverified (R9)', async () => {
    const res = await request(app)
      .post('/api/payment')
      .field('studentId', '02230456')
      .field('transactionNumber', '123-123456789');
    expect(res.status).toBe(400);
    expect(res.body.errors.join(' ')).toMatch(/screenshot/i);
  });
});

describe('Activity 4: Test Case Design (Section 2 — Registration & Decision Table)', () => {
  // TC11 - registration blocked: tuition not paid (drug test also not verified for this seed student)
  test('TC11: registration is rejected when tuition payment is not verified', async () => {
    const res = await request(app).post('/api/register').send({ studentId: '02230456', moduleCode: 'SWE302' });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Tuition payment not verified.');
  });

  // TC12 - registration blocked: payment verified but drug test not verified
  test('TC12: registration is rejected when drug testing report is not verified', async () => {
    // Verify payment first so only the drug-test condition is failing.
    await request(app)
      .post('/api/payment')
      .field('studentId', '02230456')
      .field('transactionNumber', '123-123456789')
      .attach('screenshot', Buffer.from('bytes'), 'proof.jpg');

    const res = await request(app).post('/api/register').send({ studentId: '02230456', moduleCode: 'SWE302' });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Drug testing report not verified.');
  });

  // TC13 - registration blocked: registration period closed (payment + drug test both OK)
  test('TC13: registration is rejected when the registration period is closed', async () => {
    await request(app).post('/api/admin/registration-period').send({ open: false });
    const res = await request(app).post('/api/register').send({ studentId: '02230123', moduleCode: 'SWE302' });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Registration period is closed.');
  });

  // TC14 - registration succeeds when all three conditions are satisfied
  test('TC14: registration succeeds when payment, drug test, and period are all OK', async () => {
    const res = await request(app).post('/api/register').send({ studentId: '02230123', moduleCode: 'SWE302' });
    expect(res.status).toBe(200);
    expect(res.body.registeredModules).toContain('SWE302');
  });

  // TC15 - duplicate module registration is rejected
  test('TC15: registering the same module twice is rejected', async () => {
    await request(app).post('/api/register').send({ studentId: '02230123', moduleCode: 'SWE302' });
    const res = await request(app).post('/api/register').send({ studentId: '02230123', moduleCode: 'SWE302' });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already registered/i);
  });
});

describe('Activity 4: Test Case Design (Section 4 — Result Viewing)', () => {
  // TC16 - unregistered student cannot view results
  test('TC16: a student who is not registered for any module cannot view results', async () => {
    const res = await request(app).get('/api/results/02230456');
    expect(res.status).toBe(403);
  });

  // TC17 - registered student can view results, which include module code/title/grade
  test('TC17: a registered student can view their results with module code, title, and grade', async () => {
    await request(app).post('/api/register').send({ studentId: '02230123', moduleCode: 'SWE302' });
    const res = await request(app).get('/api/results/02230123');
    expect(res.status).toBe(200);
    expect(res.body.results[0]).toEqual(
      expect.objectContaining({ moduleCode: expect.any(String), moduleTitle: expect.any(String), grade: expect.any(String) })
    );
  });

  // TC18 - registered student can download results as a PDF
  test('TC18: a registered student can download their results as a PDF', async () => {
    await request(app).post('/api/register').send({ studentId: '02230123', moduleCode: 'SWE302' });
    const res = await request(app).get('/api/results/02230123/pdf');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
  });

  // TC19 - unknown student ID returns 404 on results lookup
  test('TC19: an unknown Student ID returns 404 when viewing results', async () => {
    const res = await request(app).get('/api/results/99999999');
    expect(res.status).toBe(404);
  });
});
