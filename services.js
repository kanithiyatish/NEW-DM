const express = require('express');
const { readData } = require('../data/store');

const router = express.Router();

// GET /api/services?category=two|four
router.get('/', (req, res) => {
  const { category } = req.query;
  const services = readData('services');
  const result = category ? services.filter((s) => s.category === category) : services;
  res.json(result);
});

router.get('/:id', (req, res) => {
  const services = readData('services');
  const service = services.find((s) => s.id === req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found.' });
  res.json(service);
});

module.exports = router;
