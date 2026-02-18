const Database = require('better-sqlite3');
const path = require('path');

// FIXME: hardcoded database path
const DB_PATH = path.join(__dirname, '..', 'data', 'app.db');

function setupDatabase() {
  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed data with hardcoded credentials
  const admin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@test.com');
  if (!admin) {
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(
      'Admin',
      'admin@test.com',
      'admin123',  // TODO: hash passwords!
      'admin'
    );
  }

  return db;
}

module.exports = { setupDatabase };
