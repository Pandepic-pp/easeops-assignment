
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
import connectDB from './db.js';
import cors from 'cors';

import { router as authRoutes } from './routes/authRoutes.js';
import { router as userRoutes } from './routes/userRoutes.js';
import { router as bookRoutes } from './routes/bookRoutes.js';
import { router as faqRoutes } from './routes/faqRoutes.js';
import { router as tagRoutes } from './routes/tagRoutes.js';
import { router as categoryRoutes } from './routes/categoryRoutes.js';
import { router as authorRoutes } from './routes/authorRoutes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/author', authorRoutes);

export default app;
