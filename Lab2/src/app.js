/**
 * app.js
 * -------------------------------------------------------------------------
 * Express application implementing the SRS (Part A) as a REST API:
 *
 *   POST /api/login                 - Student Login (Section 1)
 *   POST /api/payment                - Tuition Payment upload (Section 3)
 *   POST /api/register               - Student Registration (Section 2)
 *   GET  /api/results/:studentId     - Result Viewing (Section 4)
 *   GET  /api/results/:studentId/pdf - "Download as PDF" (Section 4)
 *
 * createApp() takes a store so tests can inject a fresh in-memory store per
 * test file/suite instead of sharing global state.
 */

const express = require('express');
const path = require('path');
const multer = require('multer');

const {
  validateStudentId,
  validatePassword,
  validatePaymentScreenshot,
  validateTransactionNumber,
} = require('./validators');
const { decideRegistration } = require('./registrationDecision');

const upload = multer({ storage: multer.memoryStorage() });

function createApp(store) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // ---------------------------------------------------------------------
  // Section 1: Student Login (R1-R4)
  // ---------------------------------------------------------------------
  app.post('/api/login', (req, res) => {
    const { studentId, password } = req.body || {};

    const idCheck = validateStudentId(studentId);
    if (!idCheck.valid) {
      return res.status(400).json({ success: false, field: 'studentId', message: idCheck.reason });
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return res.status(400).json({ success: false, field: 'password', message: pwCheck.reason });
    }

    const student = store.students.get(studentId);
    if (!student || student.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid Student ID or password.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      student: { studentId: student.studentId, name: student.name },
    });
  });

  // ---------------------------------------------------------------------
  // Section 3: Tuition Payment upload (R5-R9)
  // ---------------------------------------------------------------------
  app.post('/api/payment', upload.single('screenshot'), (req, res) => {
    const { studentId, transactionNumber } = req.body || {};

    const idCheck = validateStudentId(studentId);
    if (!idCheck.valid) {
      return res.status(400).json({ success: false, field: 'studentId', message: idCheck.reason });
    }

    const student = store.students.get(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const screenshotName = req.file ? req.file.originalname : req.body.screenshotFilename;
    const screenshotCheck = validatePaymentScreenshot(screenshotName);
    const txnCheck = validateTransactionNumber(transactionNumber);

    if (!screenshotCheck.valid || !txnCheck.valid) {
      // R9: incomplete/invalid upload -> registration stays incomplete.
      student.payment = { screenshot: screenshotName || null, transactionNumber: transactionNumber || null, verified: false };
      return res.status(400).json({
        success: false,
        message: 'Payment could not be verified; upload is incomplete.',
        errors: [
          ...(screenshotCheck.valid ? [] : [screenshotCheck.reason]),
          ...(txnCheck.valid ? [] : [txnCheck.reason]),
        ],
      });
    }

    // Both fields are well-formed -> treat as verified and issue a receipt (R8).
    student.payment = { screenshot: screenshotName, transactionNumber, verified: true };
    student.tuitionPaid = true;

    return res.status(200).json({
      success: true,
      message: 'Payment verified. Electronic receipt generated.',
      receipt: {
        studentId,
        transactionNumber,
        receiptNumber: `RCPT-${studentId}-${Date.now()}`,
      },
    });
  });

  // ---------------------------------------------------------------------
  // Section 2: Student Registration
  // ---------------------------------------------------------------------
  
  // GET /api/modules - Get all available modules
  app.get('/api/modules', (req, res) => {
    const modulesArray = Array.from(store.modules.values()).map((module) => ({
      code: module.code,
      title: module.title,
      description: module.description,
      credits: module.credits,
      semester: module.semester,
      academicYear: module.academicYear,
      lecturer: module.lecturer,
      availableProgrammes: module.availableProgrammes,
    }));
    return res.status(200).json({ success: true, modules: modulesArray });
  });

  // GET /api/students/:studentId - Get student details
  app.get('/api/students/:studentId', (req, res) => {
    const { studentId } = req.params;
    const student = store.students.get(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    
    // Return student details with registered module information
    const registeredModulesDetails = student.registeredModules.map((code) => {
      const module = store.modules.get(code);
      return module ? { code: module.code, title: module.title, credits: module.credits } : { code };
    });

    return res.status(200).json({
      success: true,
      student: {
        studentId: student.studentId,
        name: student.name,
        programme: student.programme,
        semester: student.semester,
        academicYear: student.academicYear,
        tuitionPaid: student.tuitionPaid,
        drugTestVerified: student.drugTestVerified,
        registeredModules: student.registeredModules,
        registeredModulesDetails,
      },
    });
  });

  app.post('/api/register', (req, res) => {
    const { studentId, moduleCode } = req.body || {};

    const student = store.students.get(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const module = store.modules.get(moduleCode);
    if (!module) {
      return res.status(400).json({ success: false, message: `Unknown module code: ${moduleCode}` });
    }

    // Check if module is available for student's programme
    if (!module.availableProgrammes.includes(student.programme)) {
      return res.status(403).json({
        success: false,
        message: `Module ${moduleCode} is not available for your programme (${student.programme}).`,
      });
    }

    // Check if module matches student's semester
    if (module.semester !== student.semester) {
      return res.status(403).json({
        success: false,
        message: `Module ${moduleCode} is for semester ${module.semester}. You are currently in semester ${student.semester}.`,
      });
    }

    const decision = decideRegistration(
      !!student.tuitionPaid,
      !!student.drugTestVerified,
      store.getRegistrationPeriodOpen()
    );

    if (!decision.allowed) {
      return res.status(403).json({ success: false, message: decision.message });
    }

    if (student.registeredModules.includes(moduleCode)) {
      return res.status(409).json({
        success: false,
        message: `Student is already registered for ${moduleCode}. A module cannot be registered more than once.`,
      });
    }

    student.registeredModules.push(moduleCode);
    return res.status(200).json({
      success: true,
      message: `Registration successful for ${moduleCode}.`,
      registeredModules: student.registeredModules,
    });
  });

  // ---------------------------------------------------------------------
  // Section 4: Result Viewing
  // ---------------------------------------------------------------------
  app.get('/api/results/:studentId', (req, res) => {
    const { studentId } = req.params;
    const student = store.students.get(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    if (student.registeredModules.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Only registered students may view their semester results.',
      });
    }
    
    // Get results for this student
    const studentResults = store.results.get(studentId) || [];
    
    // Build results for all registered modules (including those without published results)
    const allModuleResults = student.registeredModules.map((moduleCode) => {
      const module = store.modules.get(moduleCode);
      const publishedResult = studentResults.find((r) => r.moduleCode === moduleCode);
      
      if (publishedResult) {
        return {
          moduleCode: publishedResult.moduleCode,
          moduleTitle: publishedResult.moduleTitle,
          credits: publishedResult.credits || (module ? module.credits : null),
          marks: publishedResult.marks,
          grade: publishedResult.grade,
          gradePoints: publishedResult.gradePoints,
          status: publishedResult.status,
        };
      } else {
        // Module is registered but no result published yet
        return {
          moduleCode: moduleCode,
          moduleTitle: module ? module.title : moduleCode,
          credits: module ? module.credits : null,
          marks: null,
          grade: null,
          gradePoints: null,
          status: 'Result Pending',
        };
      }
    });

    return res.status(200).json({ 
      success: true, 
      student: {
        studentId: student.studentId,
        name: student.name,
        semester: student.semester,
        academicYear: student.academicYear,
      },
      results: allModuleResults 
    });
  });

  app.get('/api/results/:studentId/pdf', (req, res) => {
    const { studentId } = req.params;
    const student = store.students.get(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    if (student.registeredModules.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Only registered students may view their semester results.',
      });
    }
    
    // Get results for this student
    const studentResults = store.results.get(studentId) || [];
    
    // Build results for all registered modules
    const allModuleResults = student.registeredModules.map((moduleCode) => {
      const module = store.modules.get(moduleCode);
      const publishedResult = studentResults.find((r) => r.moduleCode === moduleCode);
      
      if (publishedResult) {
        return {
          moduleCode: publishedResult.moduleCode,
          moduleTitle: publishedResult.moduleTitle,
          credits: publishedResult.credits || (module ? module.credits : null),
          marks: publishedResult.marks,
          grade: publishedResult.grade,
          gradePoints: publishedResult.gradePoints,
          status: publishedResult.status,
        };
      } else {
        return {
          moduleCode: moduleCode,
          moduleTitle: module ? module.title : moduleCode,
          credits: module ? module.credits : null,
          marks: null,
          grade: null,
          gradePoints: null,
          status: 'Result Pending',
        };
      }
    });

    const body = `CST College - Semester Result
Student: ${student.name} (${studentId})
Programme: ${student.programme}
Semester: ${student.semester}
Academic Year: ${student.academicYear}

${allModuleResults.map((r) => {
  const marks = r.marks !== null ? `Marks: ${r.marks}` : 'Marks: Pending';
  const grade = r.grade !== null ? `Grade: ${r.grade}` : 'Grade: Pending';
  return `${r.moduleCode}  ${r.moduleTitle}  Credits: ${r.credits}  ${marks}  ${grade}  Status: ${r.status}`;
}).join('\n')}`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${studentId}-results.pdf"`);
    // Minimal placeholder "PDF" payload for demo purposes.
    return res.status(200).send(Buffer.from(body, 'utf-8'));
  });

  // Admin/test helper endpoint used by the demo UI to flip registration period.
  app.post('/api/admin/registration-period', (req, res) => {
    const { open } = req.body || {};
    store.setRegistrationPeriodOpen(!!open);
    return res.status(200).json({ success: true, registrationPeriodOpen: store.getRegistrationPeriodOpen() });
  });

  return app;
}

module.exports = { createApp };
