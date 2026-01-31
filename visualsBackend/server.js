// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/mongodb.js'
// import connectCloudinary from './config/cloudinary.js'
// import userRouter from './routes/userRoute.js'
// import productRouter from './routes/productRoute.js'
// import cartRouter from './routes/cartRoute.js'
// import orderRouter from './routes/orderRoute.js'

// //App config
// const app=express();
// const port= process.env.PORT || 4000
// connectDB()
// connectCloudinary()

// //middlewares
// app.use(express.json())
// app.use(cors());

// //api endpoints
// app.use('/api/user',userRouter);
// app.use('/api/product', productRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/order', orderRouter);
// app.get('/',(req,res)=>{
//     res.send("API working")
// })

// app.listen(port,()=>console.log('server started on port:'+port))
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dns from 'dns';
import util from 'util';
import nodemailer from 'nodemailer';
import admin from './config/firebaseAdmin.js';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', process.env.FRONTEND_URL],
  credentials: true
}));

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error) => {
  if (error) console.error('SMTP verify failed:', error.message);
  else console.log('SMTP connection verified');
});

const resolveMx = util.promisify(dns.resolveMx);

app.post('/api/user/send-login-link', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: 'Email is required' });
  }

  try {
    const domain = email.split('@')[1];
    await resolveMx(domain);

    const actionCodeSettings = {
      url: `${process.env.FRONTEND_URL}/finish-login?email=${encodeURIComponent(
        email
      )}`,
      handleCodeInApp: true
    };

    const link = await admin
      .auth()
      .generateSignInWithEmailLink(email, actionCodeSettings);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Sign in to Sumukh Visuals',
      html: `
        <div style="padding:20px;font-family:sans-serif">
          <h2>Welcome to Sumukh Visuals</h2>
          <p>Click below to sign in</p>
          <a href="${link}" style="padding:12px 20px;background:black;color:white;text-decoration:none">
            Sign In
          </a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Magic link sent' });
  } catch (error) {
    console.error('Send login link error:', error);
    res.json({
      success: false,
      message: error.message || 'Failed to send email'
    });
  }
});

app.post('/api/contact/send-message', async (req, res) => {
  const { name, email, phone, projectType, budget, message } = req.body;

  if (!name || !email || !projectType || !message) {
    return res.json({ success: false, message: 'Missing required fields' });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: 'support@sumukhvisuals.com',
      replyTo: email,
      subject: `New Project Inquiry from ${name}`,
      html: `
        <div style="padding:20px;font-family:sans-serif;color:#333">
          <h2 style="color:#22d3ee">New Project Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p><strong>Project Type:</strong> ${projectType}</p>
          ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="background:#f5f5f5;padding:15px;border-left:4px solid #22d3ee">${message.replace(/\n/g, '<br>')}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact email sent to:', email);
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Send contact message error:', error);
    res.json({
      success: false,
      message: error.message || 'Failed to send message'
    });
  }
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Debug endpoint to test token verification
app.post('/api/debug/verify-token', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    console.log('Debug - Auth header received:', !!header);
    
    const [type, idToken] = header.split(' ');
    
    if (type !== 'Bearer' || !idToken) {
      return res.json({ success: false, message: 'Invalid header format' });
    }

    console.log('Debug - Attempting to verify token...');
    const decoded = await admin.auth().verifyIdToken(idToken);
    
    console.log('Debug - Token verified successfully!', { uid: decoded.uid, email: decoded.email });
    res.json({ 
      success: true, 
      message: 'Token verified',
      decoded: {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name
      }
    });
  } catch (error) {
    console.error('Debug - Token verification failed:', {
      message: error.message,
      code: error.code,
      fullError: error
    });
    res.status(401).json({ 
      success: false, 
      message: 'Token verification failed',
      error: error.message,
      code: error.code
    });
  }
});

app.get('/', (req, res) => {
  res.send('API working');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});