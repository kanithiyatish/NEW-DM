const express = require('express');
const { nanoid } = require('nanoid');
const { readData, writeData } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const carts = readData('carts');
  res.json(carts[req.user.id] || []);
});

router.post('/', (req, res) => {
  const { serviceId, name, price, qty } = req.body;
  if (!serviceId || !name || !price) {
    return res.status(400).json({ message: 'serviceId, name and price are required.' });
  }
  const carts = readData('carts');
  const userCart = carts[req.user.id] || [];
  userCart.push({ itemId: `item_${nanoid(8)}`, serviceId, name, price, qty: qty || 1 });
  carts[req.user.id] = userCart;
  writeData('carts', carts);
  res.status(201).json(userCart);
});

router.delete('/:itemId', (req, res) => {
  const carts = readData('carts');
  const userCart = (carts[req.user.id] || []).filter((i) => i.itemId !== req.params.itemId);
  carts[req.user.id] = userCart;
  writeData('carts', carts);
  res.json(userCart);
});

module.exports = router;
