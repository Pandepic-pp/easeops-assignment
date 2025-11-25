import User from '../models/User.js';
import Bookmark from '../models/Bookmark.js';
import Book from '../models/Book.js';
import Faq from '../models/Faq.js';
import { contactRequestMail as sendMailRequest } from '../utils/helper.js';


const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowed = {};
    if (typeof req.body.preferences !== 'undefined') {
      allowed.preferences = req.body.preferences;
    }

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: allowed },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated', data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

const addBookmark = async (req, res) => {
  try {
    const { bookId, page = 1, note = '' } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const existing = await Bookmark.findOne({ user: user._id, book: book._id, page });
    if (existing) {
      existing.note = note;
      await existing.save();
      return res.json({ message: 'Bookmark updated', data: existing });
    }

    const bm = new Bookmark({ user: user._id, book: book._id, page, note });
    await bm.save();
    res.status(201).json({ message: 'Bookmark created', data: bm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add bookmark' });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bm = await Bookmark.findOneAndDelete({ _id: id, user: user._id });
    if (!bm) return res.status(404).json({ message: 'Bookmark not found' });
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove bookmark' });
  }
};

const listBookmarks = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bookmarks = await Bookmark.find({ user: user._id }).populate('book', 'title authors').sort({ createdAt: -1 }).lean();
    res.json({ data: bookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to list bookmarks' });
  }
};

const contactRequestMail = async (req, res) => {
  try {
    const { message } = req.body;
    const userEmail = req.user.email;
    const mailSent = await sendMailRequest(userEmail, message);
    if (!mailSent) {
      return res.status(500).json({ message: 'Failed to send contact request email' });
    }
    res.json({ message: 'Contact request email sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process contact request' });
  }
};

export { getProfile, updateProfile, addBookmark, removeBookmark, listBookmarks, contactRequestMail };
