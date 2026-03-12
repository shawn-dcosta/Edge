import Inquiry from '../models/Inquiry.js';

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

    if (!['New', 'Read', 'Replied'].includes(status)) {
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
