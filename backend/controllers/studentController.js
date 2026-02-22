const store = require('../data/store');

function generateToken() {
  return 'tk_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

exports.registerRequest = (req, res, next) => {
  try {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and password are required'
    });
  }

  const existing = store.students.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'A student with this email already exists'
    });
  }

  const student = {
    id: store.nextStudentId,
    name,
    email: email.trim().toLowerCase(),
    password,
    role: 'student',
    status: 'pending',
    batchId: null,
    coachId: null,
    attendance: 0,
    feeStatus: 'Pending'
  };

  store.addStudent(student);

  res.status(201).json({
    success: true,
    message: 'Registration request submitted. Please wait for admin approval.',
    student: { id: student.id, name: student.name, email: student.email, status: student.status }
  });
  } catch (err) {
    next(err);
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const student = store.students.find(
    s => s.email.toLowerCase() === email.toLowerCase() && s.password === password
  );

  if (!student) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  if (student.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending approval. Please wait for admin to approve.'
    });
  }

  const token = generateToken();
  const batch = store.batches.find(b => b.id === student.batchId);
  const coach = student.coachId ? store.admins.find(a => a.id === student.coachId) : null;

  store.setSession(token, {
    userId: student.id,
    role: 'student',
    email: student.email,
    name: student.name
  });

  res.json({
    success: true,
    token,
    user: {
      id: student.id,
      name: student.name,
      email: student.email,
      role: 'student',
      batchId: student.batchId,
      batchName: batch?.name || 'Not assigned',
      coachId: student.coachId,
      coachName: coach?.name || 'Not assigned',
      attendance: student.attendance ?? 0,
      feeStatus: student.feeStatus || 'Pending'
    }
  });
};
