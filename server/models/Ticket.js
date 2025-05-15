const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  session:    { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  date:       { type: Date, required: true },
  time:       { type: String, required: true },
  seats:      { type: [String], required: true },
  createdAt:  { type: Date, default: () => new Date() }
})

module.exports = mongoose.model('Ticket', ticketSchema)
