const { Schema, model } = require('mongoose');

/**
 *  source:  'local' | 'tmdb'
 *  movie   — посилання на LocalMovie (лише для local)
 *  tmdbId  — ID з TMDb (лише для tmdb)
 *  data    — кеш мінімальних даних (постер, назва …) щоб не робити зайвих запитів
 */
const favoriteSchema = new Schema(
  {
    user:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, enum: ['local', 'tmdb'], required: true },
    movie:  { type: Schema.Types.ObjectId, ref: 'LocalMovie' },
    tmdbId: { type: Number },
    data:   { type: Schema.Types.Mixed },
    addedAt:{ type: Date,   default: Date.now },
  },
  { timestamps: { createdAt: 'addedAt', updatedAt: false } }
);

// один і той самий фільм не можна додати двічі
favoriteSchema.index(
  { user: 1, source: 1, movie: 1, tmdbId: 1 },
  { unique: true, sparse: true }
);

module.exports = model('Favorite', favoriteSchema);
