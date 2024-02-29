const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sort } = req.query;
    let query = `SELECT * FROM customers`;

    if (search) {
      query += ` WHERE customer_name ILIKE '%${search}%' OR location ILIKE '%${search}%'`;
    }

    if (sort === 'date') {
      query += ` ORDER BY created_at`;
    } else if (sort === 'time') {
      query += ` ORDER BY created_at::time`;
    }

    query += ` LIMIT $1 OFFSET $2`; // Using parameters to prevent SQL injection
    const values = [limit, (page - 1) * limit];

    const { rows } = await db.query(query, values);
    
    // Get total count without limit for pagination
    const totalCountQuery = `SELECT COUNT(*) FROM customers`;
    const totalCount = await db.query(totalCountQuery);
    
    res.json({
      rows,
      total: parseInt(totalCount.rows[0].count, 10) // Convert to integer
    });
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
