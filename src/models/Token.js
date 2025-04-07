import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['refresh'],
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  blacklisted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para melhorar performance de queries
tokenSchema.index({ token: 1 });
tokenSchema.index({ userId: 1 });
tokenSchema.index({ expires: 1 });

const Token = mongoose.model('Token', tokenSchema);

export default Token;
