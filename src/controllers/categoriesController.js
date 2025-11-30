import Category from "../models/Category.js";
import Book from "../models/Book.js";

const createCategory = async (req, res) => {
    try {
        const { name } = req.body; 
        if (!name) return res.status(400).json({ message: 'Category name is required' });
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).json({ message: 'Category already exists' });
        }
        const category = new Category({ name });
        await category.save();
        res.status(201).json({ message: 'Category created', category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create category' });
    }
};

const listCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json({ categories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        const allBooks = await Book.find();
        for (const book of allBooks) {
            book.categories = book.categories.filter(catId => catId.toString() !== category._id.toString());
            await book.save();
        }

        res.json({ message: 'Category deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete category' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Category name is required' });
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category updated', data: category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update category' });
    }
};

export { createCategory, listCategories, deleteCategory, updateCategory };