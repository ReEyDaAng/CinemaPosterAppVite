const express  = require('express');
const Favorite = require('../models/FavoriteMovie');
const auth     = require('../middleware/auth');

const router = express.Router();

// GET /api/favorites  → поточний список
router.get('/', auth, async (req, res) => {
  const list = await Favorite
    .find({ user: req.user.id })
    // якщо favorite.source === 'local' → підтягнути LocalMovie
    .populate('movie')          // { path:'movie', select:'title posterUrl genre_ids vote_average' }
    .lean();

  res.json(list);
});

// POST /api/favorites  { source:'local'|'tmdb', movieId, data }
router.post('/', auth, async (req, res, next) => {
  try {
    const { source, movieId, data } = req.body;
    const doc =
      source === 'local'
        ? { user: req.user.id, source, movie: movieId }
        : { user: req.user.id, source, tmdbId: movieId, data };

    const fav = await Favorite.create(doc);
    res.status(201).json(fav);
  } catch (e) {
    // 11000 = duplicate key — просто повертаємо «OK», бо вже в обраному
    if (e.code === 11000) return res.sendStatus(200);
    next(e);
  }
});

// DELETE /api/favorites/:id   → видалити за _id
router.delete('/:id', auth, async (req, res) => {
  await Favorite.deleteOne({ _id: req.params.id, user: req.user.id });
  res.sendStatus(204);
});

module.exports = router;
