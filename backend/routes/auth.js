const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const user = results[0];
    req.session.user = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    };

    return res.status(200).json({
      message: 'Login successful.',
      user: req.session.user
    });
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed.' });
    }
    return res.status(200).json({ message: 'Logged out successfully.' });
  });
});

// GET /api/auth/me  ← useful to check who is logged in
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in.' });
  }
  return res.status(200).json({ user: req.session.user });
});

module.exports = router;