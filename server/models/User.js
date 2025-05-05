const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username:     { type: String, required: true, unique: true },
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, default: 'user' },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

module.exports = model('User', userSchema);
