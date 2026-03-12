import { Router } from 'express';
import { 
  getPortfolioItems, 
  getPortfolioItemsByCategory, 
  createPortfolioItem, 
  deletePortfolioItem 
} from '../controllers/portfolioController.js';

const router = Router();

router.get('/', getPortfolioItems);
router.get('/category/:category', getPortfolioItemsByCategory);
router.post('/', createPortfolioItem);
router.delete('/:id', deletePortfolioItem);

export default router;
