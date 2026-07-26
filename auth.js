const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const { readData, writeData } = require('../data/store');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ message: 'Name, phone and password are required.' });
  }
  const users = readData('users');
  if (users.find((u) => u.phone === phone)) {
    return res.status(409).json({ message: 'An account with this phone number already exists.' });
  }
  const user = {
    id: `user_${nanoid(10)}`,
    name,
    phone,
    email: email || null,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeData('users', users);

  const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email } });
});

router.post('/login', (req, res) => {
  const { phone, password } = req.body;
  const users = readData('users');
  const user = users.find((u) => u.phone === phone);
  if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid phone number or password.' });
  }
  const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email } });
});

module.exports = router;
