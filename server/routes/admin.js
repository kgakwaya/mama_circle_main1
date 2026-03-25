const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool   = require('../db/pool');
const { protect, restrictTo } = require('../middleware/auth');

const adminOnly = [protect, restrictTo('admin')];

// GET /api/admin/stats
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [users, posts, messages, rooms] = await Promise.all([
      pool.query(`SELECT role, COUNT(*) FROM users GROUP BY role`),
      pool.query(`SELECT status, COUNT(*) FROM posts GROUP BY status`),
      pool.query(`SELECT COUNT(*) FROM messages`),
      pool.query(`SELECT COUNT(*) FROM chat_rooms`),
    ]);
    res.json({
      users: users.rows,
      posts: posts.rows,
      totalMessages: parseInt(messages.rows[0].count),
      totalRooms: parseInt(rooms.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nickname, role, is_active, created_at FROM users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/psychologists  — create a psychologist account
router.post('/psychologists', ...adminOnly, async (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password)
    return res.status(400).json({ message: 'Nickname and password required' });
  try {
    const exists = await pool.query(`SELECT id FROM users WHERE nickname = $1`, [nickname]);
    if (exists.rows.length)
      return res.status(400).json({ message: 'Nickname already taken' });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (nickname, password, role) VALUES ($1, $2, 'psychologist') RETURNING id, nickname, role`,
      [nickname, hash]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/users/:id/toggle  — activate / deactivate
router.patch('/users/:id/toggle', ...adminOnly, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, nickname, is_active`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', ...adminOnly, async (req, res) => {
  try {
    await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/flagged-posts
router.get('/flagged-posts', ...adminOnly, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.id, p.title, p.content, p.reports, p.status, p.created_at,
             u.nickname AS author_nickname
      FROM posts p
      LEFT JOIN users u ON u.id = p.author_id
      WHERE p.status IN ('flagged','removed')
      ORDER BY p.reports DESC, p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/activity  — recent messages across all rooms (for monitoring)
router.get('/activity', ...adminOnly, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT m.id, m.content, m.created_at, m.is_anonymous,
             u.nickname AS sender_nickname, u.role AS sender_role,
             cr.name AS room_name, cr.type AS room_type
      FROM messages m
      LEFT JOIN users u ON u.id = m.sender_id
      LEFT JOIN chat_rooms cr ON cr.id = m.room_id
      ORDER BY m.created_at DESC
      LIMIT 200`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
