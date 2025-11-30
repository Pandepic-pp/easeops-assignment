import express from 'express';
const router = express.Router();
import { createTag, listTags, deleteTag, updateTag } from '../controllers/tagsController.js';

router.post('/', createTag);
router.get('/', listTags);
router.delete('/:id', deleteTag);
router.put('/:id', updateTag);

export {router};