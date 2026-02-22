const store = require('../data/store');

function generateToken() {
  return 'tk_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  const session = store.getSession(token);
  if (!session || session.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
  req.session = session;
  next();
}

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const admin = store.admins.find(
    a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const token = generateToken();
  store.setSession(token, {
    userId: admin.id,
    role: 'admin',
    email: admin.email,
    name: admin.name
  });

  res.json({
    success: true,
    token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'admin'
    }
  });
};

exports.getPendingRequests = [
  requireAdmin,
  (req, res) => {
    const pending = store.students.filter(s => s.status === 'pending');
    res.json({
      success: true,
      students: pending.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        status: s.status
      }))
    });
  }
];

exports.approveStudent = [
  requireAdmin,
  (req, res) => {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'studentId is required' });
    }
    const student = store.students.find(s => s.id === Number(studentId));
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    if (student.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Student is not pending' });
    }
    store.updateStudent(student.id, {
      status: 'approved',
      batchId: student.batchId || store.batches[0]?.id || null,
      coachId: student.coachId || store.admins[0]?.id || null,
      attendance: student.attendance ?? 0,
      feeStatus: student.feeStatus || 'Pending'
    });
    res.json({ success: true, message: 'Student approved' });
  }
];

exports.rejectStudent = [
  requireAdmin,
  (req, res) => {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'studentId is required' });
    }
    const removed = store.deleteStudent(Number(studentId));
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student rejected and removed' });
  }
];

exports.deleteStudent = [
  requireAdmin,
  (req, res) => {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'studentId is required' });
    }
    const removed = store.deleteStudent(Number(studentId));
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted' });
  }
];

exports.getStudents = [
  requireAdmin,
  (req, res) => {
    const students = store.students.map(s => {
      const batch = store.batches.find(b => b.id === s.batchId);
      const coach = s.coachId ? store.admins.find(a => a.id === s.coachId) : null;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        status: s.status,
        batchId: s.batchId,
        batchName: batch?.name || null,
        coachId: s.coachId,
        coachName: coach?.name || null,
        attendance: s.attendance ?? 0,
        feeStatus: s.feeStatus || 'Pending'
      };
    });
    res.json({ success: true, students });
  }
];

exports.createBatch = [
  requireAdmin,
  (req, res) => {
    const { name, coachId } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Batch name is required' });
    }
    const batch = {
      id: store.nextBatchId,
      name: name.trim(),
      coachId: coachId ? Number(coachId) : store.admins[0]?.id || null
    };
    store.addBatch(batch);
    res.status(201).json({ success: true, batch });
  }
];

exports.assignStudent = [
  requireAdmin,
  (req, res) => {
    const { studentId, batchId } = req.body;
    if (!studentId || !batchId) {
      return res.status(400).json({ success: false, message: 'studentId and batchId are required' });
    }
    const student = store.students.find(s => s.id === Number(studentId));
    const batch = store.batches.find(b => b.id === Number(batchId));
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
    store.updateStudent(student.id, { batchId: batch.id, coachId: batch.coachId });
    res.json({ success: true, message: 'Student assigned to batch' });
  }
];

exports.deleteBatch = [
  requireAdmin,
  (req, res) => {
    const { batchId } = req.body;
    if (!batchId) {
      return res.status(400).json({ success: false, message: 'batchId is required' });
    }
    const removed = store.deleteBatch(Number(batchId));
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }
    res.json({ success: true, message: 'Batch deleted' });
  }
];

exports.updateContent = [
  requireAdmin,
  (req, res) => {
    const { aboutUs, batchDetails, awards } = req.body;
    const updates = {};
    if (typeof aboutUs === 'string') updates.aboutUs = aboutUs;
    if (typeof batchDetails === 'string') updates.batchDetails = batchDetails;
    if (typeof awards === 'string') updates.awards = awards;
    store.updateContent(updates);
    res.json({ success: true, message: 'Content updated' });
  }
];

exports.getBatches = [
  requireAdmin,
  (req, res) => {
    const batches = store.batches.map(b => {
      const coach = b.coachId ? store.admins.find(a => a.id === b.coachId) : null;
      return {
        id: b.id,
        name: b.name,
        coachId: b.coachId,
        coachName: coach?.name || null
      };
    });
    res.json({ success: true, batches });
  }
];
