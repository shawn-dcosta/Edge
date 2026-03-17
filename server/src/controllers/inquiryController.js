import Inquiry from '../models/Inquiry.js';
import { sendInquiryNotification } from '../utils/emailService.js';

export const submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;
    
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newInquiry = new Inquiry({
      name,
      email,
      phone,
      company,
      message
    });

    await newInquiry.save();
    
    // Trigger Email Notification (Non-blocking)
    sendInquiryNotification({ name, email, phone, company, message }).catch(err => {
      console.error('Failed to send background email notification:', err);
    });

    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting inquiry', error });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'Read'].includes(status)) {
       return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    if (!updatedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    res.json(updatedInquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating inquiry status' });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInquiry = await Inquiry.findByIdAndDelete(id);
    
    if (!deletedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry' });
  }
};

export const bulkUpdateInquiryStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!['New', 'Read'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    await Inquiry.updateMany({ _id: { $in: ids } }, { $set: { status } });
    res.json({ message: `Successfully updated ${ids.length} inquiries` });
  } catch (error) {
    res.status(500).json({ message: 'Error bulk updating inquiries' });
  }
};

export const bulkDeleteInquiries = async (req, res) => {
  try {
    const { ids } = req.body;
    await Inquiry.deleteMany({ _id: { $in: ids } });
    res.json({ message: `Successfully deleted ${ids.length} inquiries` });
  } catch (error) {
    res.status(500).json({ message: 'Error bulk deleting inquiries' });
  }
};
