const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const sessionRoutes = require('./routes/sessions');
const favRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin');
const auth        = require('./middleware/auth');

require('dotenv').config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use('/api/auth',    authRoutes);
app.use('/api/movies',  movieRoutes);
app.use('/api/sessions',sessionRoutes);
app.use('/api/favorites', favRoutes);
app.use('/api/admin', auth, adminRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

const PORT = process.env.PORT || 5000;
// якщо жоден маршрут не спрацював — не «висіти», а повернути 404
app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' });
});

// обробка помилок, щоб не «зависнути» при виключенні
app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR]', err);
  return res
    .status(500)
    .json({ message: err.message || 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
