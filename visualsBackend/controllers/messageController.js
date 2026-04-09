import Message from '../models/messageModel.js';

// Get all messages for a reel
export const getReelMessages = async (req, res) => {
  try {
    const { projectId, reelNumber } = req.params;

    console.log(`📍 Fetching messages for project ${projectId}, reel ${reelNumber}`);

    const messages = await Message.find({
      projectId,
      reelNumber: parseInt(reelNumber),
    })
      .sort({ createdAt: 1 })
      .lean();

    console.log(`✅ Found ${messages.length} messages`);
    res.json({ success: true, messages });
  } catch (error) {
    console.error('❌ Failed to fetch messages:', error);
    res.status(500).json({ message: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { projectId, reelNumber } = req.params;
    const { content, senderType, senderUID, senderName, senderAvatar } = req.body;

    if (!content || !senderType || !senderUID || !senderName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log(`📍 Sending message to project ${projectId}, reel ${reelNumber} from ${senderType}`);

    const message = new Message({
      projectId,
      reelNumber: parseInt(reelNumber),
      senderType,
      senderUID,
      senderName,
      senderAvatar: senderAvatar || `https://via.placeholder.com/40?text=${senderName.charAt(0)}`,
      content,
    });

    await message.save();
    console.log(`✅ Message saved:`, message);

    res.json({ success: true, message });
  } catch (error) {
    console.error('❌ Failed to send message:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a message (edit)
export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        content,
        isEdited: true,
        editedAt: new Date(),
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    console.log(`✅ Message updated:`, message);
    res.json({ success: true, message });
  } catch (error) {
    console.error('❌ Failed to update message:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    console.log(`✅ Message deleted`);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('❌ Failed to delete message:', error);
    res.status(500).json({ message: error.message });
  }
};
