import { Router } from 'express';
import productRoutes from './productRoutes';
import emailRoutes from './emailRoutes';
import userRoutes from './userRoutes';
import qrRoutes from './qrRoutes';

const router = Router();

router.use('/products', productRoutes);
router.use('/emails', emailRoutes);
router.use('/users', userRoutes);
router.use('/qrcodes', qrRoutes);

export default router;
