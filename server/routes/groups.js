const router = require('express').Router();
const pool   = require('../db/pool');
const { protect, restrictTo } = require('../middleware/auth');

// GET /api/groups
router.get('/', protect, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT g.id, g.name, g.description, g.max_size, g.created_at,
             (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) AS member_count,
             EXISTS(
               SELECT 1 FROM group_members gm2
               WHERE gm2.group_id = g.id AND gm2.user_id = $1
             ) AS is_member
      FROM groups g
      ORDER BY g.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/groups  (psychologist / admin)
router.post('/', protect, restrictTo('psychologist', 'admin'), async (req, res) => {
  const { name, description, maxSize } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO groups (name, description, max_size, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, maxSize || 50, req.user.id]
    );
    const group = rows[0];

    // create a dedicated chat room for this group
    const room = await client.query(
      `INSERT INTO chat_rooms (name, type, group_id) VALUES ($1, 'group', $2) RETURNING id`,
      [group.name, group.id]
    );
    // add creator as member of both
    await client.query(
      `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`,
      [group.id, req.user.id]
    );
    await client.query(
      `INSERT INTO chat_room_members (room_id, user_id) VALUES ($1, $2)`,
      [room.rows[0].id, req.user.id]
    );
    await client.query('COMMIT');
    res.status(201).json(group);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

// POST /api/groups/:id/join
router.post('/:id/join', protect, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: [group] } = await client.query(`SELECT * FROM groups WHERE id = $1`, [req.params.id]);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const { rows: [membership] } = await client.query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (membership) return res.status(400).json({ message: 'Already a member' });

    const { rows: [{ count }] } = await client.query(
      `SELECT COUNT(*) FROM group_members WHERE group_id = $1`, [req.params.id]
    );
    if (parseInt(count) >= group.max_size)
      return res.status(400).json({ message: 'Group is full' });

    await client.query(
      `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`,
      [req.params.id, req.user.id]
    );

    // also add to the group's chat room
    const { rows: rooms } = await client.query(
      `SELECT id FROM chat_rooms WHERE group_id = $1 LIMIT 1`, [req.params.id]
    );
    if (rooms[0]) {
      await client.query(
        `INSERT INTO chat_room_members (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [rooms[0].id, req.user.id]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Joined successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

// POST /api/groups/:id/leave
router.post('/:id/leave', protect, async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    const { rows: rooms } = await pool.query(
      `SELECT id FROM chat_rooms WHERE group_id = $1 LIMIT 1`, [req.params.id]
    );
    if (rooms[0]) {
      await pool.query(
        `DELETE FROM chat_room_members WHERE room_id = $1 AND user_id = $2`,
        [rooms[0].id, req.user.id]
      );
    }
    res.json({ message: 'Left group' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
