import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, index: true },
    reelNumber: { type: Number, required: true },
    senderType: { type: String, enum: ['admin', 'client'], required: true },
    senderUID: { type: String, required: true }, // Firebase UID
    senderName: { type: String, required: true },
    senderAvatar: { type: String },
    content: { type: String, required: true },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
  },
  { timestamps: true }
);

// Index for efficient reel chat queries
messageSchema.index({ projectId: 1, reelNumber: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
