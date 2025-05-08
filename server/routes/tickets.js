const express = require('express')
const Ticket  = require('../models/Ticket')
const auth    = require('../middleware/auth') // ваш JWT-мідлвар

const router = express.Router()

// POST /api/tickets — бронювання
router.post('/', auth, async (req, res) => {
  try {
    const { sessionId, date, time, seats } = req.body
    if (!sessionId || !date || !time || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Неповні дані для бронювання' })
    }

    const ticket = await Ticket.create({
      user:    req.user.id,
      session: sessionId,
      date:    new Date(date),
      time,
      seats
    })
    res.status(201).json(ticket)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Не вдалося забронювати квитки' })
  }
})

module.exports = router
