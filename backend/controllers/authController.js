// In-memory session storage (demo purposes)
const sessions = new Map();

// Dummy user data for demo
const USERS = [
  { id: 1, email: 'admin@maaai.com', password: 'admin123', name: 'Admin User' },
  { id: 2, email: 'student@maaai.com', password: 'student123', name: 'Demo Student' }
];

function generateToken() {
  return 'tk_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const user = USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const token = generateToken();
  sessions.set(token, {
    userId: user.id,
    email: user.email,
    name: user.name
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
};

exports.getUser = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  res.json({
    success: true,
    user: {
      id: session.userId,
      email: session.email,
      name: session.name
    }
  });
};
