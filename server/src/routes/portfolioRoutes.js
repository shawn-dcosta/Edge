import { Router } from 'express';
import {
  getPortfolioItems,
  getPortfolioItemsByCategory,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../controllers/portfolioController.js';
import { adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getPortfolioItems);
router.get('/category/:category', getPortfolioItemsByCategory);
router.post('/', adminOnly, createPortfolioItem);
router.put('/:id', adminOnly, updatePortfolioItem);
router.delete('/:id', adminOnly, deletePortfolioItem);

export default router;
