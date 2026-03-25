const router = require('express').Router();
const pool   = require('../db/pool');
const { protect, restrictTo } = require('../middleware/auth');

// GET /api/posts
router.get('/', protect, async (req, res) => {
  try {
    const { rows: posts } = await pool.query(`
      SELECT p.id, p.title, p.content, p.is_anonymous, p.status, p.reports, p.created_at,
             u.nickname AS author_nickname, u.role AS author_role,
             (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.status = 'active') AS comment_count
      FROM posts p
      LEFT JOIN users u ON u.id = p.author_id
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
    `);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts
router.post('/', protect, async (req, res) => {
  const { title, content, isAnonymous } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO posts (author_id, title, content, is_anonymous)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [req.user.id, title, content, isAnonymous || false]
    );
    const post = rows[0];
    res.status(201).json({
      ...post,
      author_nickname: req.user.nickname,
      author_role: req.user.role,
      comment_count: 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:id/comments
router.get('/:id/comments', protect, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.id, c.content, c.is_anonymous, c.created_at,
             u.nickname AS author_nickname, u.role AS author_role
      FROM comments c
      LEFT JOIN users u ON u.id = c.author_id
      WHERE c.post_id = $1 AND c.status = 'active'
      ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
  const { content, isAnonymous } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO comments (post_id, author_id, content, is_anonymous)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.id, req.user.id, content, isAnonymous || false]
    );
    res.status(201).json({ ...rows[0], author_nickname: req.user.nickname, author_role: req.user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id/report
router.put('/:id/report', protect, async (req, res) => {
  try {
    await pool.query(`
      UPDATE posts SET reports = reports + 1,
        status = CASE WHEN reports + 1 >= 5 THEN 'flagged' ELSE status END
      WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Reported' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id/moderate  (moderator / admin)
router.put('/:id/moderate', protect, restrictTo('psychologist', 'admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE posts SET status = $1 WHERE id = $2 RETURNING *`,
      [req.body.status, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
