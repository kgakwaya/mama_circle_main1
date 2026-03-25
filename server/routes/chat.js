const router = require('express').Router();
const pool   = require('../db/pool');
const { protect } = require('../middleware/auth');

// GET /api/chat/rooms  — rooms the user belongs to
router.get('/rooms', protect, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT cr.id, cr.name, cr.type, cr.group_id,
             (SELECT m.content FROM messages m WHERE m.room_id = cr.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
             (SELECT m.created_at FROM messages m WHERE m.room_id = cr.id ORDER BY m.created_at DESC LIMIT 1) AS last_message_at
      FROM chat_rooms cr
      JOIN chat_room_members crm ON crm.room_id = cr.id
      WHERE crm.user_id = $1
      ORDER BY last_message_at DESC NULLS LAST`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/chat/rooms/:id/messages  — history (last 100)
router.get('/rooms/:id/messages', protect, async (req, res) => {
  try {
    // ensure user is a member
    const { rows: [member] } = await pool.query(
      `SELECT 1 FROM chat_room_members WHERE room_id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (!member) return res.status(403).json({ message: 'Not a member of this room' });

    const { rows } = await pool.query(`
      SELECT m.id, m.content, m.is_anonymous, m.created_at,
             u.id AS sender_id, u.nickname AS sender_nickname, u.role AS sender_role
      FROM messages m
      LEFT JOIN users u ON u.id = m.sender_id
      WHERE m.room_id = $1
      ORDER BY m.created_at ASC
      LIMIT 100`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/chat/direct/:userId  — open or get a direct room with a psychologist
router.post('/direct/:userId', protect, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const otherId = req.params.userId;

    // find existing direct room between the two users
    const existing = await client.query(`
      SELECT cr.id FROM chat_rooms cr
      JOIN chat_room_members a ON a.room_id = cr.id AND a.user_id = $1
      JOIN chat_room_members b ON b.room_id = cr.id AND b.user_id = $2
      WHERE cr.type = 'direct'
      LIMIT 1`,
      [req.user.id, otherId]
    );
    if (existing.rows[0]) {
      await client.query('COMMIT');
      return res.json({ roomId: existing.rows[0].id });
    }

    // create new direct room
    const { rows: [room] } = await client.query(
      `INSERT INTO chat_rooms (type) VALUES ('direct') RETURNING id`
    );
    await client.query(
      `INSERT INTO chat_room_members (room_id, user_id) VALUES ($1,$2),($1,$3)`,
      [room.id, req.user.id, otherId]
    );
    await client.query('COMMIT');
    res.status(201).json({ roomId: room.id });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

// GET /api/chat/psychologists  — list available psychologists
router.get('/psychologists', protect, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, nickname, role FROM users WHERE role = 'psychologist' AND is_active = true ORDER BY nickname`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
