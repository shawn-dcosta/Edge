import mongoose from 'mongoose';

const PortfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Award Functions', 
      'Exhibitions', 
      'Corporate Events', 
      'Conferences', 
      'Retail Merchandising', 
      'Weddings', 
      'Televised Events',
      'Mall Activity',
      'Other'
    ]
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('PortfolioItem', PortfolioItemSchema);
