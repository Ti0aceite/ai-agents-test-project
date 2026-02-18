const express = require('express');
const cors = require('cors');
const { setupDatabase } = require('./db');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// TODO: Configure CORS properly for production
app.use(cors());
app.use(express.json());

const db = setupDatabase();

app.use('/api/users', userRoutes(db));
app.use('/api/products', productRoutes(db));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
