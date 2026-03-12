import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Read', 'Replied'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Inquiry', InquirySchema);
