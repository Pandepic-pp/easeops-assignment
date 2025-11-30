
import { Router } from 'express';
import verifyAuthToken from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/requireAdmin.js';
import upload, { UPLOAD_DIR } from '../middlewares/uploadMiddleware.js';
import createUploadRateLimiter from '../middlewares/uploadRateLimiter.js';
import { uploadBook, listBooks, getBook, serveBookFile, addFeedback, updateBook } from '../controllers/bookController.js';

const router = Router();
const uploadRateLimiter = createUploadRateLimiter();

router.post('/upload', verifyAuthToken, requireAdmin, uploadRateLimiter, upload.single('file'), uploadBook);
router.post('/feedback/:id', verifyAuthToken, addFeedback);
router.get('/', listBooks);
router.get('/:id', getBook);
router.get('/:id/file', verifyAuthToken, serveBookFile);
router.put('/', verifyAuthToken, requireAdmin, updateBook)

export { router };