const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  session:      { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  purchaseDate: { type: Date, default: Date.now },
  price:        { type: Number, required: true },
});

module.exports = mongoose.model('Ticket', ticketSchema);
