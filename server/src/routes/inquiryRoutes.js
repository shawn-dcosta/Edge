import { Router } from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus, deleteInquiry, bulkUpdateInquiryStatus, bulkDeleteInquiries } from '../controllers/inquiryController.js';
import { adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', submitInquiry);
router.get('/', adminOnly, getInquiries);
router.patch('/bulk-status', adminOnly, bulkUpdateInquiryStatus);
router.delete('/bulk-delete', adminOnly, bulkDeleteInquiries);
router.put('/:id/status', adminOnly, updateInquiryStatus);
router.delete('/:id', adminOnly, deleteInquiry);

export default router;
