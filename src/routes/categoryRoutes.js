import Router from 'express';
const router = Router();
import { createCategory, listCategories, deleteCategory, updateCategory } from '../controllers/categoriesController.js';

router.post('/', createCategory);
router.get('/', listCategories);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

export {router};