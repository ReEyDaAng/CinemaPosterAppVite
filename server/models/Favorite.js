const { Schema, model } = require('mongoose');

/**
 *  Favorite:
 *    source = 'local' | 'tmdb'
 *    movie  = ObjectId → LocalMovie    (якщо source === 'local')
 *    tmdbId = Number                   (якщо source === 'tmdb')
 *    data   = {}                       (копія TMDb-даних, опц.)
 */
const favoriteSchema = new Schema(
  {
    user:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, enum: ['local', 'tmdb'], required: true },
    movie:  { type: Schema.Types.ObjectId, ref: 'LocalMovie' },
    tmdbId: { type: Number },
    data:   { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

favoriteSchema.index({ user: 1, movie: 1 }, { unique: true, sparse: true });
favoriteSchema.index({ user: 1, tmdbId: 1 }, { unique: true, sparse: true });

module.exports = model('Favorite', favoriteSchema);
