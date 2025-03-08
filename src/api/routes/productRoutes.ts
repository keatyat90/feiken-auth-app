import { Router } from 'express';
import { verifyProduct } from '../controllers/productController';

const router = Router();

router.get('/verify/:id', verifyProduct);

export default router;
