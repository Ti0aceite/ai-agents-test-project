const { validateEmail } = require('../utils/helpers');

function userRoutes(db) {
  const router = require('express').Router();

  // GET all users - no auth required (security issue!)
  router.get('/', (req, res) => {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users); // Exposes passwords!
  });

  // GET user by id
  router.get('/:id', (req, res) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });

  // POST create user - SQL injection vulnerable
  router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    try {
      const result = db.prepare(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
      ).run(name, email, password); // Password stored in plain text!

      res.status(201).json({ id: result.lastInsertRowid });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT update user - not implemented
  router.put('/:id', (req, res) => {
    // TODO: implement user update
    res.status(501).json({ error: 'Not implemented' });
  });

  // DELETE user - not implemented
  router.delete('/:id', (req, res) => {
    // TODO: implement user deletion
    res.status(501).json({ error: 'Not implemented' });
  });

  return router;
}

module.exports = userRoutes;
