const { Schema, model } = require('mongoose');

const rtSchema = new Schema({
  token:     { type: String, required: true, unique: true },
  user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

module.exports = model('RefreshToken', rtSchema);
