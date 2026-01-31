import admin from '../config/firebaseAdmin.js';

const authUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    console.log('Auth header:', header.substring(0, 50) + '...');
    
    const [type, idToken] = header.split(' ');

    if (type !== 'Bearer' || !idToken) {
        console.log('Invalid header format. Type:', type, 'Has token:', !!idToken);
        return res.status(401).json({ success: false, message: 'Not Authorized.' });
    }

    console.log('Verifying token...');
    const decoded = await admin.auth().verifyIdToken(idToken);
    
    console.log('Token verified. UID:', decoded.uid, 'Email:', decoded.email);

    // Initialize req.body if it doesn't exist (for GET requests)
    if (!req.body) {
      req.body = {};
    }
    
    req.body.userId = decoded.uid;
    req.body.userEmail = decoded.email;
    
    // Also set on req object for easier access in all methods
    req.userId = decoded.uid;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    console.error('Auth error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    return res.status(401).json({ success: false, message: 'Invalid token', error: error.message });
  }
};

export default authUser;