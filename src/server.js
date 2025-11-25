
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
import connectDB from './db.js';
import cors from 'cors';

import { router as authRoutes } from './routes/authRoutes.js';
import { router as userRoutes } from './routes/userRoutes.js';
import { router as bookRoutes } from './routes/bookRoutes.js';
import { router as faqRoutes } from './routes/faqRoutes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/faq', faqRoutes);

export default app;
