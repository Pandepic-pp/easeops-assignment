import { Router } from 'express';
import verifyAuthToken from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile, addBookmark, removeBookmark, listBookmarks, contactRequestMail } from '../controllers/userController.js';

const router = Router();

router.get('/me', verifyAuthToken, getProfile);
router.put('/me', verifyAuthToken, updateProfile);
router.post('/bookmarks', verifyAuthToken, addBookmark);
router.post('/contact', verifyAuthToken, contactRequestMail);
router.get('/bookmarks', verifyAuthToken, listBookmarks);
router.delete('/bookmarks/:id', verifyAuthToken, removeBookmark);

export { router };
