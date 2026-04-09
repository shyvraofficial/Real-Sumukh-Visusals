import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    firebaseUID: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, default: '' },
    avatar: { type: String, default: null },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
    },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for email lookup
clientSchema.index({ email: 1 });

const Client = mongoose.model('Client', clientSchema);

export default Client;
