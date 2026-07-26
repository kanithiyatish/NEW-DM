const express = require('express');
const { nanoid } = require('nanoid');
const { readData, writeData } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// POST /api/bookings — checkout the current cart into a confirmed booking
router.post('/', (req, res) => {
  const { date, timeSlot, address, vehicle } = req.body;
  const carts = readData('carts');
  const items = carts[req.user.id] || [];
  if (!items.length) return res.status(400).json({ message: 'Your cart is empty.' });

  const total = items.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
  const bookings = readData('bookings');
  const booking = {
    id: `bkg_${nanoid(10)}`,
    userId: req.user.id,
    items,
    total,
    date: date || null,
    timeSlot: timeSlot || null,
    address: address || null,
    vehicle: vehicle || null,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  writeData('bookings', bookings);

  carts[req.user.id] = [];
  writeData('carts', carts);

  res.status(201).json(booking);
});

router.get('/', (req, res) => {
  const bookings = readData('bookings').filter((b) => b.userId === req.user.id);
  res.json(bookings);
});

module.exports = router;
