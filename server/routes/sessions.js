const express = require('express');
const Session = require('../models/Session');
const auth = require('../middleware/auth');

const router = express.Router();

// всі сеанси
router.get('/', async (req, res) => {
  res.json(await Session.findAll());
});

// додати (захищено)
router.post('/', auth, async (req, res) => {
  const s = await Session.create(req.body);
  res.status(201).json(s);
});

module.exports = router;
