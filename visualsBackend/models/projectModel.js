import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema({
  reelNumber: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Not Started', 'Getting Started', 'In Progress', 'Revision Phase', 'Successfully Delivered'],
    default: 'Not Started',
  },
  note: { type: String, default: '' },
  link: { type: String, default: null },
  name: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema(
  {
    clientId: { type: String, index: true, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, default: '' },
    projectName: { type: String, required: true },
    projectType: { type: String, required: true },
    packageType: { type: String, required: true },
    deadline: { type: Date, required: true },
    totalReels: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, required: true },
    deliveryTime: { type: String, default: '' },
    notes: { type: String, default: '' },
    reels: [reelSchema],
    status: {
      type: String,
      enum: ['active', 'completed', 'on_hold', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
