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
      'Others'
    ]
  },
  imageUrl: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
  },
  eventDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('PortfolioItem', PortfolioItemSchema);
