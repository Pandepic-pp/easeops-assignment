import path from 'path';
import fs from 'fs';
import Book from '../models/Book.js';
import Bookmark from '../models/Bookmark.js';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Tag from '../models/Tag.js';
import Category from '../models/Category.js';
import { sendNewReleaseMail } from '../utils/helper.js';
import Author from '../models/Author.js';

const uploadBook = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const { title, description, authorIds, categoriesIds, tagsIds } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!authorIds) return res.status(400).json({ message: 'At least one author is required' });
    if (!categoriesIds) return res.status(400).json({ message: 'At least one category is required' });
    if (!tagsIds) return res.status(400).json({ message: 'At least one tag is required' });

    const toArray = (data) => {
        if (!data) return [];
        return Array.isArray(data) ? data : [data];
    };

    const finalAuthors = toArray(authorIds);
    const finalCategories = toArray(categoriesIds);
    const finalTags = toArray(tagsIds);

    const validCategories = [];
    for (const catId of finalCategories) {
      const category = await Category.findById(catId);
      if (!category) return res.status(400).json({ message: `Category ID ${catId} not found` });
      validCategories.push(catId);
    }

    for (const tagId of finalTags) {
      const tag = await Tag.findById(tagId); 
      if (!tag) return res.status(400).json({ message: `Tag ID ${tagId} not found` });
    }

    const validAuthors = [];
    for (const authorId of finalAuthors) {
      const author = await Author.findById(authorId);
      if (!author) return res.status(400).json({ message: `Author ID ${authorId} not found` });
      validAuthors.push(authorId);
    }

    const book = new Book({
      title,
      description,
      authors: validAuthors,      
      categories: validCategories, 
      tags: finalTags,
      filename: file.originalname,
      filepath: file.path, 
      mimetype: file.mimetype,
      size: file.size,
      uploadedBy: req.currentUser ? req.currentUser._id : undefined
    });

    await book.save();
    
    res.status(201).json({ message: 'Book uploaded', book });
  } catch (error) {
    console.error("Upload Error:", error); 
    res.status(500).json({ message: 'Upload failed', error: error.message });
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
    res.json({ books: books, page: Number(page), limit: Number(limit), total });
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
    const { feedback, stars } = req.body;
    if (!stars) return res.status(400).json({ message: 'Stars is required' });  
    const book = await Book.findById(req.params.id);
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    const fb = new Feedback({
      bookId: book._id,
      userId: user._id,
      comment: feedback || '',
      stars
    });

    await fb.save();

    res.json({ message: 'Feedback added', feedback: book.feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add feedback' });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, authorIds, tagIds, categoryIds } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (authorIds) updateData.authors = JSON.parse(authorIds);
    if (tagIds) updateData.tags = JSON.parse(tagIds);
    if (categoryIds) updateData.categories = JSON.parse(categoryIds);

    const book = await Book.findByIdAndUpdate(id, updateData, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.json({ message: 'Book updated', data: book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update book' });
  }
};

export { uploadBook, listBooks, getBook, serveBookFile, addFeedback, updateBook };