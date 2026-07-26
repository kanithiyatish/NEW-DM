const express = require('express');
const { readData } = require('../data/store');

const router = express.Router();

// GET /api/vehicles/brands?type=two|four
router.get('/brands', (req, res) => {
  const { type } = req.query;
  const brands = readData('vehicles');
  if (type) return res.json(brands[type] || []);
  res.json(brands);
});

module.exports = router;
