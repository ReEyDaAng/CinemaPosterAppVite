const { Schema, model } = require('mongoose');

const favSchema = new Schema({
  user:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: Schema.Types.ObjectId, ref: 'LocalMovie', required: true },
  addedAt: { type: Date, default: Date.now }
});

// унікальний індекс для пари (user, movie)
favSchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = model('FavoriteMovie', favSchema);
