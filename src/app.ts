import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './db/connect'
import authRoutes from './router/authroutes'
// import authenticate from './middleware/authmiddleware';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' }
}));

// Routes
app.use('/api/auth', authRoutes);

// Middleware
// app.get('/api/protected', authenticate, (req, res) => {
//   res.status(200).json({ message: 'This is a protected route', user: req.user });
// });

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  console.log('DB Connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start()
