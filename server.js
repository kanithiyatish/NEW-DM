const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const vehicleRoutes = require('./routes/vehicles');
const offerRoutes = require('./routes/offers');
const cartRoutes = require('./routes/cart');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'drivemate-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not found.' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on our end.' });
});

app.listen(PORT, () => {
  console.log(`DriveMate backend running → http://localhost:${PORT}`);
});
