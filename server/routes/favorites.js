const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const LocalMovie = require('../models/LocalMovie');
const authenticate = require('../middleware/auth');

// GET /api/favorites
router.get('/', authenticate, async (req, res) => {
  try {
    const favs = await Favorite.find({ user: req.user.id });

    const tmdbFavs = favs.filter((f) => f.source === 'tmdb');
    const localFavs = favs.filter((f) => f.source === 'local');
    const localMovieIds = localFavs.map((f) => f.movie);

    const localMovies = await LocalMovie.find({ _id: { $in: localMovieIds } });

    const populatedLocal = localFavs.map((fav) => {
      const movieDoc = localMovies.find((m) => m._id.equals(fav.movie));
      return { ...fav.toObject(), movie: movieDoc || null };
    });

    res.json([
      ...populatedLocal,
      ...tmdbFavs.map((f) => f.toObject())
    ]);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ message: 'Не вдалося завантажити обрані фільми' });
  }
});

// POST /api/favorites
router.post('/', authenticate, async (req, res) => {
  let { source, movieId, data } = req.body;

  try {
    // Перетворення movieId на ObjectId, якщо це локальний фільм
    if (source === 'local') {
      try {
        movieId = new mongoose.Types.ObjectId(movieId);
      } catch (e) {
        return res.status(400).json({ message: 'Некоректний movieId' });
      }
    }

    // Перевірка, чи запис вже існує
    const existingQuery = source === 'local'
      ? { user: req.user.id, source, movie: movieId }
      : { user: req.user.id, source, tmdbId: movieId };

    const existing = await Favorite.findOne(existingQuery);

    if (existing) {
      if (source === 'local') {
        const movie = await LocalMovie.findById(movieId);
        return res.status(200).json({ ...existing.toObject(), movie });
      }
      return res.status(200).json(existing);
    }

    // Створення нового запису
    let fav;
    if (source === 'local') {
      fav = await Favorite.create({ user: req.user.id, source, movie: movieId });
      const movie = await LocalMovie.findById(movieId);
      return res.status(201).json({ ...fav.toObject(), movie });
    } else {
      fav = await Favorite.create({ user: req.user.id, source, tmdbId: movieId, data });
      return res.status(201).json(fav);
    }
  } catch (e) {
    // Обробка дублювання
    if (e.code === 11000) {
      const fallbackQuery = source === 'local'
        ? { user: req.user.id, source, movie: movieId }
        : { user: req.user.id, source, tmdbId: movieId };

      const existing = await Favorite.findOne(fallbackQuery);
      if (!existing) {
        return res.status(200).json({ message: 'Favorite already exists but not found' });
      }

      if (source === 'local') {
        const movie = await LocalMovie.findById(movieId);
        return res.status(200).json({ ...existing.toObject(), movie });
      }

      return res.status(200).json(existing);
    }

    console.error('[GLOBAL ERROR]', e);
    return res.status(500).json({ message: e.message || 'Internal Server Error' });
  }
});

// DELETE /api/favorites/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await Favorite.deleteOne({ _id: req.params.id, user: req.user.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Favorite not found or already deleted' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting favorite:', err);
    res.status(500).json({ message: 'Не вдалося видалити фільм з обраного' });
  }
});

module.exports = router;
