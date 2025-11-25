import path from 'path';
import fs from 'fs';
import Book from '../models/Book.js';
import Bookmark from '../models/Bookmark.js';
import { sendNewReleaseMail } from '../utils/helper.js';

const uploadBook = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const { title, description = '', authors = '[]', categories = '[]', tags = '[]' } = req.body;

    const book = new Book({
      title,
      description,
      authors: JSON.parse(authors),
      categories: JSON.parse(categories),
      tags: JSON.parse(tags),
      filename: file.originalname,
      filepath: file.path, 
      mimetype: file.mimetype,
      size: file.size,
      uploadedBy: req.currentUser ? req.currentUser._id : undefined
    });

    await book.save();
    await sendNewReleaseMail(title, req.user.email);
    res.status(201).json({ message: 'Book uploaded', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

const listBooks = async (req, res) => {
  try {
    const { category, tag, q, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (category) filter.categories = category;
    if (tag) filter.tags = tag;
    if (q) filter.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-filepath -mimetype -size') 
      .lean();

    const total = await Book.countDocuments(filter);
    res.json({ data: books, page: Number(page), limit: Number(limit), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list books' });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ data: book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get book' });
  }
};

const serveBookFile = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const absolute = path.resolve(book.filepath);
    if (!fs.existsSync(absolute)) return res.status(404).json({ message: 'File missing on server' });

    const disposition = req.query.download === '1' ? 'attachment' : 'inline';
    res.setHeader('Content-Type', book.mimetype || 'application/pdf');
    res.setHeader('Content-Disposition', `${disposition}; filename="${book.filename}"`);
    const stream = fs.createReadStream(absolute);
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to serve file' });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    if (!feedback) return res.status(400).json({ message: 'Feedback is required' });  
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    book.feedback.push(feedback);
    await book.save();
    res.json({ message: 'Feedback added', feedback: book.feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add feedback' });
  }
};

export { uploadBook, listBooks, getBook, serveBookFile, addFeedback };
