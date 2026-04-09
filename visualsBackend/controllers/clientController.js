import Client from '../models/clientModel.js';

// Auto-create or update client on first login
export const createOrUpdateClient = async (req, res) => {
  try {
    const { firebaseUID, email, name, avatar } = req.body;

    if (!firebaseUID || !email) {
      return res.status(400).json({ message: 'Firebase UID and email required' });
    }

    let client = await Client.findOne({ firebaseUID });

    if (client) {
      // Update last login
      client.lastLogin = new Date();
      if (name) client.name = name;
      if (avatar) client.avatar = avatar;
      await client.save();
    } else {
      // Create new client
      client = new Client({
        firebaseUID,
        email: email.toLowerCase().trim(),
        name: name || email.split('@')[0],
        avatar: avatar || null,
      });
      await client.save();
    }

    res.status(201).json({
      success: true,
      message: 'Client created/updated',
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all clients (for admin dropdown)
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({ status: 'active' }).select('_id email name avatar').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      clients,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get client by email
export const getClientByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const client = await Client.findOne({ email: email.toLowerCase().trim() });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found. They must sign up first.',
      });
    }

    res.json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get client by Firebase UID
export const getClientByUID = async (req, res) => {
  try {
    const { uid } = req.params;

    const client = await Client.findOne({ firebaseUID: uid });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    res.json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
