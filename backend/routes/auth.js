const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();

// Register
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) return res.status(400).json({ message: 'Username already taken' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)')
                  .run(username, email, hash);
                  
  const token = jwt.sign({ id: info.lastInsertRowid, username }, 'my_super_secret_key_123', { expiresIn: '7d' });
  res.json({ token, username });
});
  
// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  if (!bcrypt.compareSync(password, user.password))
    return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, 'my_super_secret_key_123', { expiresIn: '7d' });
  res.json({ token, username: user.username });
});

module.exports = router;
