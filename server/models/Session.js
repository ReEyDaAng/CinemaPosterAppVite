const { Schema, model } = require('mongoose');

const sessionSchema = new Schema({
  movie:       { type: Schema.Types.ObjectId, ref: 'LocalMovie', required: true },
  sessionTime: { type: Date, required: true },
  hall:        String,
  price:       Number,
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

module.exports = model('Session', sessionSchema);
