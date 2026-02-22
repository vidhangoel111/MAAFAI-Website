const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '../uploads');
const store = require('../data/store');

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

exports.uploadImage = [
  requireAdmin,
  (req, res) => {
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, url, filename: req.file.filename });
  }
];

exports.getImages = (req, res) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      return res.json({ success: true, images: [] });
    }
    const files = fs.readdirSync(UPLOADS_DIR)
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map(f => ({ filename: f, url: `/uploads/${f}` }));
    res.json({ success: true, images: files });
  } catch (e) {
    res.json({ success: true, images: [] });
  }
};
