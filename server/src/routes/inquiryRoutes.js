import { Router } from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus } from '../controllers/inquiryController.js';
import { adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', submitInquiry);
router.get('/', adminOnly, getInquiries);
router.put('/:id/status', adminOnly, updateInquiryStatus);

export default router;
