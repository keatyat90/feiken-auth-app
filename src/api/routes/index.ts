import { Router } from 'express';
import productRoutes from './productRoutes';
import emailRoutes from './emailRoutes';

const router = Router();

router.use('/products', productRoutes);
router.use('/emails', emailRoutes);

export default router;
