import { Request, Response } from 'express';
import User from '../models/user.model'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Sign up a new user
export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(201).json({ message: 'User created', token, email });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ message: 'Error creating user', error: errorMessage });
  }
};

// Log in an existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user?.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user?._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Login successful', token, email });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ message: 'Error logging in', error: errorMessage });
  }
};

// Logout the user
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};