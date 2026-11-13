const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, 'my_super_secret_key_123'); // Ensure this matches auth.js
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// GET LEVELS + USER PROGRESS
router.get('/levels/:difficulty', auth, (req, res) => {
  const { difficulty } = req.params;
  
  // Get all levels for this difficulty
  const levels = db.prepare(
    'SELECT id, word, hint_sentence, extra_hint, difficulty FROM levels WHERE difficulty = ?'
  ).all(difficulty);

  // Find which level_ids this user has already completed
  const completedRows = db.prepare(`
    SELECT level_id FROM scores 
    WHERE user_id = ? AND points > 0
  `).all(req.user.id);
  
  const completed_ids = completedRows.map(r => r.level_id);

  res.json({ levels, completed_ids });
});

// SUBMIT SCORE
router.post('/submit', auth, (req, res) => {
  const { level_id, hints_used, completed } = req.body;
  const basePoints = { easy: 100, medium: 150, hard: 200 };
  
  const level = db.prepare('SELECT * FROM levels WHERE id = ?').get(level_id);
  if (!level) return res.status(404).json({ message: 'Level not found' });

  let points = 0;
  
  if (completed) {
    const base = basePoints[level.difficulty] || 100;
    points = Math.max(0, Math.round(base - (hints_used * base * 0.3)));

    // Save the score record
    db.prepare('INSERT INTO scores (user_id, level_id, points, hints_used) VALUES (?, ?, ?, ?)')
      .run(req.user.id, level_id, points, hints_used);

    // Update the user's total score
    db.prepare('UPDATE users SET total_score = total_score + ? WHERE id = ?')
      .run(points, req.user.id);
  }

  const user = db.prepare('SELECT total_score FROM users WHERE id = ?').get(req.user.id);
  res.json({ points, total_score: user.total_score });
});

// LEADERBOARD
router.get('/leaderboard', (req, res) => {
  const rows = db.prepare('SELECT username, total_score FROM users ORDER BY total_score DESC LIMIT 10').all();
  res.json(rows);
});

module.exports = router;
