const express = require('express');
const { readData } = require('../data/store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(readData('offers'));
});

module.exports = router;
