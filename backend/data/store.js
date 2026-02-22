const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

let data = {
  students: [],
  batches: [],
  admins: [],
  sessions: {},
  content: {
    aboutUs: '',
    batchDetails: '',
    awards: ''
  },
  nextStudentId: 1,
  nextBatchId: 1,
  nextAdminId: 1
};

function load() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    data = { ...data, ...JSON.parse(raw) };
  } catch {
    // Seed demo data
    data.admins = [
      { id: 1, email: 'admin@maaai.com', password: 'admin123', name: 'Admin User', role: 'admin' },
      { id: 2, email: 'coach@maaai.com', password: 'coach123', name: 'Coach Demo', role: 'admin' }
    ];
    data.batches = [
      { id: 1, name: 'Batch 2024-A', coachId: 1 },
      { id: 2, name: 'Batch 2024-B', coachId: 2 }
    ];
    data.students = [
      { id: 1, name: 'Approved Student', email: 'student@maaai.com', password: 'student123', role: 'student', status: 'approved', batchId: 1, coachId: 1, attendance: 92, feeStatus: 'Paid' }
    ];
    data.nextStudentId = 2;
    data.nextBatchId = 3;
    data.nextAdminId = 3;
    data.content = {
      aboutUs: 'MAAFAI Academy is dedicated to nurturing talent and fostering excellence. Our experienced coaches and structured programs help you achieve your full potential in a disciplined, supportive environment.',
      batchDetails: 'We offer multiple batches throughout the year. Each batch is led by qualified coaches and follows a comprehensive curriculum.\n• Batch 2024-A – Morning sessions\n• Batch 2024-B – Evening sessions',
      awards: 'Our students and academy have been recognized for excellence in training and performance.\n• Excellence in Training Award 2023\n• Outstanding Student Achievement 2024'
    };
    save();
  }
}

function save() {
  const toSave = { ...data };
  delete toSave.sessions;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(toSave, null, 2));
  } catch (e) {
    console.warn('Could not save data file:', e.message);
  }
}

load();

module.exports = {
  get students() { return data.students; },
  get batches() { return data.batches; },
  get admins() { return data.admins; },
  get sessions() { return data.sessions; },
  get nextStudentId() { return data.nextStudentId; },
  get nextBatchId() { return data.nextBatchId; },
  get nextAdminId() { return data.nextAdminId; },

  addStudent(student) {
    data.students.push(student);
    data.nextStudentId++;
    save();
    return student;
  },

  updateStudent(id, updates) {
    const idx = data.students.findIndex(s => s.id === id);
    if (idx === -1) return null;
    data.students[idx] = { ...data.students[idx], ...updates };
    save();
    return data.students[idx];
  },

  deleteStudent(id) {
    const idx = data.students.findIndex(s => s.id === id);
    if (idx === -1) return false;
    data.students.splice(idx, 1);
    save();
    return true;
  },

  addBatch(batch) {
    data.batches.push(batch);
    data.nextBatchId++;
    save();
    return batch;
  },

  deleteBatch(id) {
    const idx = data.batches.findIndex(b => b.id === id);
    if (idx === -1) return false;
    data.batches.splice(idx, 1);
    // Unassign students from this batch
    data.students.forEach(s => {
      if (s.batchId === id) {
        s.batchId = null;
        s.coachId = null;
      }
    });
    save();
    return true;
  },

  setSession(token, session) {
    data.sessions[token] = session;
  },

  getSession(token) {
    return data.sessions[token] || null;
  },

  removeSession(token) {
    delete data.sessions[token];
  },

  get content() {
    return data.content || { aboutUs: '', batchDetails: '', awards: '' };
  },

  updateContent(updates) {
    data.content = { ...(data.content || {}), ...updates };
    save();
    return data.content;
  },

  save
};
