const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../db/pool');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password)
    return res.status(400).json({ message: 'Nickname and password required' });
  try {
    const exists = await pool.query(`SELECT id FROM users WHERE nickname = $1`, [nickname]);
    if (exists.rows.length)
      return res.status(400).json({ message: 'Nickname already taken' });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (nickname, password) VALUES ($1, $2)
       RETURNING id, nickname, role`,
      [nickname, hash]
    );
    const user = rows[0];

    // Auto-join the general chat room
    const room = await pool.query(
      `SELECT id FROM chat_rooms WHERE type = 'general' LIMIT 1`
    );
    if (room.rows[0]) {
      await pool.query(
        `INSERT INTO chat_room_members (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [room.rows[0].id, user.id]
      );
    }

    res.status(201).json({ ...user, token: sign(user.id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { nickname, password } = req.body;
  try {
    const { rows } = await pool.query(
      `SELECT id, nickname, role, password, is_active FROM users WHERE nickname = $1`,
      [nickname]
    );
    const user = rows[0];
    if (!user || !user.is_active)
      return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ id: user.id, nickname: user.nickname, role: user.role, token: sign(user.id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
