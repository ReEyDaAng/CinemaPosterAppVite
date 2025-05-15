const express = require('express');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
require('dotenv').config();

const router = express.Router();

// Утиліти для генерації токенів
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
}

// POST /api/auth/register
router.post('/register',(req, res, next) => {
    console.log('[🚀 REGISTER HIT] req.body =', req.body);
    next();
  }, async (req, res) => {
  try {
    const { username, email, password, confirm } = req.body;
    if (password !== confirm)
      return res.status(400).json({ message: 'Паролі не співпадають' });

    if (await User.findOne({ username }))
      return res.status(400).json({ message: 'Нікнейм зайнятий' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email вже існує' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Щось пішло не так' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ message: 'Невірні облікові дані' });

    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // записуємо в Mongo
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await RefreshToken.create({ token: refreshToken, user: user._id, expiresAt });

    res
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: expiresAt })
      .json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Помилка авторизації' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // перевіряємо, що такий токен є в БД і не прострочений
    const stored = await RefreshToken.findOne({
      where: { token, userId: payload.id }
    });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // видаємо нові токени
    const user = await User.findByPk(payload.id);
    const newAccess  = generateAccessToken(user);
    const newRefresh = generateRefreshToken(user);

    // замінюємо старий refreshToken у БД
    stored.token     = newRefresh;
    stored.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await stored.save();

    // оновлюємо cookie і віддаємо access
    res
      .cookie('refreshToken', newRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .json({ accessToken: newAccess });

  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    // видаляємо з БД
    await RefreshToken.deleteOne({ token });
    res.clearCookie('refreshToken');
  }
  res.sendStatus(204);
});

module.exports = router;
