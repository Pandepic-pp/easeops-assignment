import Faq from '../models/Faq.js';

const getFaq = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 }).lean();
    res.json({ data: faqs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get FAQ' });
  } 
};

const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await Faq.findByIdAndDelete(id);
        if (!faq) {
        return res.status(404).json({ message: 'FAQ not found' });
        }
        res.json({ message: 'FAQ deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete FAQ' });
    }
}

const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;
        const faq = await Faq.findByIdAndUpdate(id, { question, answer }, { new: true });
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        res.json({ data: faq });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update FAQ' });
    }
}

const createFaq = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const newFaq = new Faq({ question, answer });
        await newFaq.save();
        res.status(201).json({ data: newFaq });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create FAQ' });
    }
}

export {getFaq, deleteFaq, updateFaq, createFaq};