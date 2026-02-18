function productRoutes(db) {
  const router = require('express').Router();

  // GET all products with N+1 query pattern
  router.get('/', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();

    // N+1: fetching related data one by one
    const enriched = products.map(product => {
      const stockHistory = db.prepare(
        'SELECT * FROM products WHERE category = ?'
      ).all(product.category);
      return { ...product, relatedCount: stockHistory.length };
    });

    res.json(enriched);
  });

  // GET product by id
  router.get('/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  // POST create product
  router.post('/', (req, res) => {
    const { name, description, price, stock, category } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // No validation on price (could be negative)
    const result = db.prepare(
      'INSERT INTO products (name, description, price, stock, category) VALUES (?, ?, ?, ?, ?)'
    ).run(name, description || '', price, stock || 0, category || 'general');

    res.status(201).json({ id: result.lastInsertRowid });
  });

  // PUT update product - not implemented
  router.put('/:id', (req, res) => {
    res.status(501).json({ error: 'Not implemented' });
  });

  // DELETE product - not implemented
  router.delete('/:id', (req, res) => {
    res.status(501).json({ error: 'Not implemented' });
  });

  // POST bulk import - reads file synchronously
  router.post('/import', (req, res) => {
    const fs = require('fs');
    try {
      // HACK: synchronous file read in request handler
      const data = fs.readFileSync(req.body.filePath, 'utf-8');
      const products = JSON.parse(data);
      // Process each product individually (should be batch)
      products.forEach(p => {
        db.prepare(
          'INSERT INTO products (name, price) VALUES (?, ?)'
        ).run(p.name, p.price);
      });
      res.json({ imported: products.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = productRoutes;
