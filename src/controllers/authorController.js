import Author from '../models/Author.js';

const addAuthor = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Author name is required' });
        }
        const author = new Author({ name });
        await author.save();
        res.status(201).json({ message: 'Author added', author });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add author' });
    }
}

const getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.status(200).json({ authors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get authors' });
    }
}

const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const author = await Author.findByIdAndDelete(id);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete author' });
    }
}

const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const author = await Author.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json({ message: 'Author updated', author });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update author' });
    }
}

export { addAuthor, getAuthors, deleteAuthor, updateAuthor };