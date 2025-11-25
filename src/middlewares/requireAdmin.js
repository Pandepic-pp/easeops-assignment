import User from '../models/User.js';

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findOne({ email: req.user.email }).lean();
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.currentUser = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error in admin check' });
  }
};

export default requireAdmin;
