const express = require('express');
const Favorite = require('../models/FavoriteMovie');
const auth = require('../middleware/auth');

const router = express.Router();

// список улюблених поточного
router.get('/', auth, async (req, res) => {
  res.json(await Favorite.findAll({ where: { userId: req.user.id } }));
});

// додати до улюблених
router.post('/', auth, async (req, res) => {
  const f = await Favorite.create({ 
    userId: req.user.id, 
    movieId: req.body.movieId 
  });
  res.status(201).json(f);
});

// прибрати
router.delete('/:movieId', auth, async (req, res) => {
  await Favorite.destroy({ 
    where: { userId: req.user.id, movieId: req.params.movieId } 
  });
  res.sendStatus(204);
});

module.exports = router;
