import { Router } from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus } from '../controllers/inquiryController.js';

const router = Router();

router.post('/', submitInquiry);
router.get('/', getInquiries);
router.put('/:id/status', updateInquiryStatus);

export default router;
