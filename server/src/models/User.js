import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String
  },
  companyName: {
    type: String
  },
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
