import Tag from '../models/Tag.js';
import Book from '../models/Book.js';

const createTag = async (req, res) => {
    try {
        const { name } = req.body; 
        if (!name) return res.status(400).json({ message: 'Tag name is required' });

        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return res.status(409).json({ message: 'Tag already exists' });
        }
        const tag = new Tag({ name });
        await tag.save();
        res.status(201).json({ message: 'Tag created', tag });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create tag' });
    }
};

const listTags = async (req, res) => {
    try {
        const tags = await Tag.find().sort({ createdAt: -1 });
        res.json({ tags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch tags' });
    }
};

const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findByIdAndDelete(id);
        if (!tag) return res.status(404).json({ message: 'Tag not found' });
        
        const allBooks = await Book.find();
        for (const book of allBooks) {
            book.tags = book.tags.filter(tagId => tagId.toString() !== tag._id.toString());
            await book.save();
        }

        res.json({ message: 'Tag deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete tag' });
    }
};

const updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Tag name is required' });
        const tag = await Tag.findByIdAndUpdate(id, { name }, { new: true });
        if (!tag) return res.status(404).json({ message: 'Tag not found' });
        res.json({ message: 'Tag updated', data: tag });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update tag' });
    }
};

export { createTag, listTags, deleteTag, updateTag };