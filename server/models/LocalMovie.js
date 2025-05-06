const { Schema, model } = require('mongoose');

const movieSchema = new Schema({
  title:        String,
  description:  String,
  genre:        String,
  releaseYear:  Number,
  rating:       Number,
  posterPath:   String,
  createdBy:    { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

module.exports = model('LocalMovie', movieSchema);
