import { Router } from 'express';
import {
  getPortfolioItems,
  getPortfolioItemsByCategory,
  createPortfolioItem,
  deletePortfolioItem
} from '../controllers/portfolioController.js';
import { adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getPortfolioItems);
router.get('/category/:category', getPortfolioItemsByCategory);
router.post('/', adminOnly, createPortfolioItem);
router.delete('/:id', adminOnly, deletePortfolioItem);

export default router;
