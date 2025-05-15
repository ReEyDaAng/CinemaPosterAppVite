const { Schema, model } = require('mongoose');

const movieSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  genres:      { type: [String], default: [] },
  releaseYear: { type: Number },
  rating:      { type: Number },
  posterPath:  { type: String, default: '' },
  createdBy:   { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

module.exports = model('LocalMovie', movieSchema);
