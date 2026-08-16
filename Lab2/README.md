# CST College — Student Management System

A Node.js/Express implementation of the SWE302 Lab 1 SRS (Student Login,
Student Registration, Tuition Payment, Result Viewing), with a homepage,
a college logo, and a **Log In** button in the header — plus an automated
Jest test suite covering Equivalence Partitioning, Boundary Value Analysis,
Decision Table Testing, and end-to-end test cases.

## Project layout

```
cst-sms/
├── server.js                    # entry point (starts the Express app)
├── src/
│   ├── app.js                   # Express app + all REST routes
│   ├── store.js                 # in-memory "database" with seed data
│   ├── validators.js            # R1, R2, R3, R4, R6, R7 field validation
│   └── registrationDecision.js  # Activity 3 decision table logic
├── public/                      # frontend (homepage, login, register, payment, results)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── payment.html
│   ├── results.html
│   ├── css/style.css
│   ├── js/*.js
│   └── img/logo.svg             # college crest/logo
└── tests/
    ├── validators.test.js            # Activity 1 + Activity 2
    ├── registrationDecision.test.js  # Activity 3
    └── api.test.js                   # Activity 4 (15+ end-to-end cases)
```

## Getting started

```bash
npm install
npm start          # runs at http://localhost:3000
```

Open `http://localhost:3000` — the homepage shows the CST College logo and
a **Log In** link in the header. Demo account: `02230123` / `Passw0rd1`
(this student already has tuition paid and drug test verified, so
registration and results pages work immediately). The second seed account,
`02230456` / `Secure99A`, has neither cleared yet, so it's useful for testing
the payment flow and the "registration rejected" paths.

## Running the automated tests

```bash
npm test                 # runs the full Jest suite
npm run test:coverage    # same, with a coverage report
```

## Requirement → implementation → test mapping

| SRS Requirement | Implemented in | Verified by |
|---|---|---|
| R1 Student ID mandatory | `validators.js: validateStudentId` | `validators.test.js` |
| R2 Student ID = 8 digits, numeric | `validators.js: validateStudentId` | `validators.test.js` (EP + BVA) |
| R3 Password mandatory | `validators.js: validatePassword` | `validators.test.js` |
| R4 Password 8–12 chars, upper+lower+number | `validators.js: validatePassword` | `validators.test.js` (EP + BVA) |
| R5 Mobile Banking only | UI copy on `payment.html` (process constraint, not a field to validate) | — |
| R6 Screenshot mandatory, JPG/JPEG/PNG | `validators.js: validatePaymentScreenshot` | `validators.test.js`, `api.test.js` TC07/TC08/TC10 |
| R7 Transaction number format | `validators.js: validateTransactionNumber` | `validators.test.js` (EP + BVA), `api.test.js` TC09 |
| R8 Verified payment ⇒ receipt | `app.js: POST /api/payment` | `api.test.js` TC07 |
| R9 Unverifiable/incomplete ⇒ registration stays incomplete | `app.js: POST /api/payment`, `POST /api/register` | `api.test.js` TC08, TC10, TC11 |
| Registration gating (payment / drug test / period) | `registrationDecision.js` | `registrationDecision.test.js` (all 8 combinations), `api.test.js` TC11–TC14 |
| No duplicate module registration | `app.js: POST /api/register` | `api.test.js` TC15 |
| Result viewing restricted to registered students | `app.js: GET /api/results/:studentId` | `api.test.js` TC16–TC19 |
| Result display: Module Code / Title / Grade | `store.js`, `app.js` | `api.test.js` TC17 |
| Results downloadable as PDF | `app.js: GET /api/results/:studentId/pdf` | `api.test.js` TC18 |

## API summary

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/login` | Student login (R1–R4) |
| POST | `/api/payment` | Upload tuition payment proof (R5–R9), `multipart/form-data` with fields `studentId`, `transactionNumber`, `screenshot` |
| POST | `/api/register` | Register for a module (`studentId`, `moduleCode`) |
| GET | `/api/results/:studentId` | View results (JSON) |
| GET | `/api/results/:studentId/pdf` | Download results as a PDF |
| POST | `/api/admin/registration-period` | Test/demo helper to open or close the registration window (`{ "open": true|false }`) |

## Design notes

The homepage/header/forms use a navy-and-gold "college crest" palette
(`#0D1830` ink navy, `#C9A227` crest gold, `#F6F4EE` parchment) with
Fraunces for display type, Source Sans 3 for body text, and IBM Plex Mono
for IDs/transaction numbers/codes — reinforcing that these are structured,
validated data fields. The hero's signature element is a digital
student-ID "ticket stub," tying the visual design back to the Student ID
and verification-status fields defined in the SRS.
