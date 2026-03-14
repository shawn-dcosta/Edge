import PortfolioItem from '../models/PortfolioItem.js';

export const getPortfolioItems = async (req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio items' });
  }
};

export const getPortfolioItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await PortfolioItem.find({ category }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio items by category' });
  }
};

export const createPortfolioItem = async (req, res) => {
  try {
    const { title, category, imageUrl, images, description } = req.body;
    
    if (!title || !category || !imageUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newItem = new PortfolioItem({
      title,
      category,
      imageUrl,
      images,
      description
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating portfolio item', error });
  }
};

export const deletePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await PortfolioItem.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio item' });
  }
};
