const express = require('express');
const multer  = require('multer');
const path = require('path');
const auth    = require('../middleware/auth');
const Film    = require('../models/LocalMovie');
const Session = require('../models/Session');
const Ticket  = require('../models/Ticket');

const router = express.Router();

// --------------------------------------
// Фільми
// Налаштування multer для збереження постерів
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// GET /api/admin/genres
router.get('/genres', (req, res) => {
  res.json(["Action","Comedy","Drama","Horror","Sci-Fi","Romance"]);
});

// GET /api/admin/films/:id — отримати локальний фільм за ID
router.get('/films/:id', async (req, res) => {
  try {
    const movie = await Film.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Фільм не знайдено' });
    }
    res.json(movie);
  } catch (err) {
    console.error('Помилка при завантаженні фільму:', err);
    res.status(500).json({ message: 'Не вдалося завантажити фільм' });
  }
});

// GET /api/admin/films
router.get('/films', async (req, res) => {
  try {
    const films = await Film.find().sort({ _id: 1 });
    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не вдалося завантажити фільми' });
  }
});

// POST /api/admin/films
router.post('/films', upload.single('poster'), async (req, res) => {
  try {
    const { title, description, releaseYear, rating } = req.body;
    const genres = req.body.genres
      ? JSON.parse(req.body.genres)
      : [];
    const posterPath = req.file ? `/uploads/${req.file.filename}` : '';
    const createdBy = req.user.id;

    const newFilm = new Film({ title, description, genres, releaseYear, rating, posterPath, createdBy });
    const saved = await newFilm.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create film error:', err);
       res.status(400).json({
     message: err.message,
     details: err.errors
   });
  }
});

// PATCH /api/admin/films/:id
router.patch('/films/:id', upload.single('poster'), async (req, res) => {
  try {
    const update = {};
    ['title','description','releaseYear','rating'].forEach(f => {
      if (req.body[f] != null) update[f] = req.body[f];
    });
    if (req.body.genres) update.genres = JSON.parse(req.body.genres);
    if (req.file) update.posterPath = `/uploads/${req.file.filename}`;

    const updated = await Film.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Не вдалося оновити фільм' });
  }
});

// DELETE /api/admin/films/:id
router.delete('/films/:id', async (req, res) => {
  try {
    await Film.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не вдалося видалити фільм' });
  }
});

// --------------------------------------
// Сеанси
// GET /api/admin/sessions
router.get('/sessions', async (req, res) => {
  try {
      const sessions = await Session
        .find()
        .sort({ sessionTime: 1 })
        .populate('movie', 'title');

    console.log('Sessions from DB:', sessions);

    const data = sessions.map(s => ({
      id:         s._id,
      date:       s.sessionTime.toISOString().split('T')[0],
      time:       s.sessionTime.toISOString().split('T')[1].slice(0,5),
      movieTitle: s.movie?.title || '-',
      price:      s.price,
    }));

    res.json(data);
  } catch (err) {
    console.error('GET /api/admin/sessions failed:', err);
    res.status(500).json({
      message: 'Не вдалося завантажити сеанси',
      error:   err.message,
      stack:   err.stack.split('\n').slice(0,5) // перші 5 рядків стектрейсу
    });
  }
});

// POST /api/admin/sessions
router.post('/sessions', async (req, res) => {
  try {
    const { movie, sessionTime, price } = req.body;
    const newSess = new Session({ movie, sessionTime, price });
    const saved = await newSess.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Невірні дані сеансу' });
  }
});

// PATCH /api/admin/sessions/:id
router.patch('/sessions/:id', async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Не вдалося оновити сеанс' });
  }
});

// PATCH price only: PATCH /api/admin/sessions/:id/price
router.patch('/sessions/:id/price', async (req, res) => {
  try {
    const { price } = req.body;
    const sess = await Session.findByIdAndUpdate(req.params.id, { price }, { new: true });
    res.json({ price: sess.price });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Не вдалося оновити ціну' });
  }
});

// DELETE /api/admin/sessions/:id
router.delete('/sessions/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не вдалося видалити сеанс' });
  }
});

// --------------------------------------
// Статистика
// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const agg = await Ticket.aggregate([
      { $project: { day: { $dateToString: { format: '%Y-%m-%d', date: '$purchaseDate' } }, price: 1 } },
      { $group: { _id: '$day', sales: { $sum: '$price' } } },
      { $sort: { _id: 1 } },
    ]);
    const stats = agg.map(r => ({ date: r._id, sales: r.sales }));
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Не вдалося завантажити статистику' });
  }
});

// POST /api/admin/tickets —> створення квитка
router.post('/tickets', auth, async (req, res) => {
  try {
    const { session, date, time, seats } = req.body;

    // базова валідація
    if (!session || !date || !time || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Неповні дані бронювання' });
    }

    // Створюємо й зберігаємо
    const ticket = new Ticket({
      session,
      date,
      time,
      seats,
      user: req.user.id
    });

    const saved = await ticket.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create ticket error:', err);
    res.status(500).json({ message: 'Не вдалося створити квиток' });
  }
});

module.exports = router;
