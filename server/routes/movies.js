const express = require('express');
const LocalMovie = require('../models/LocalMovie');
const auth = require('../middleware/auth');

const router = express.Router();

// всі фільми
router.get('/', async (req, res) => {
  res.json(await LocalMovie.findAll());
});

// додати новий
router.post('/', auth, async (req, res) => {
  const m = await LocalMovie.create({ 
    ...req.body, 
    createdById: req.user.id 
  });
  res.status(201).json(m);
});

module.exports = router;
