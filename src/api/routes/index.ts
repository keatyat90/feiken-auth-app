import { Router } from 'express';
import productRoutes from './productRoutes';
import emailRoutes from './emailRoutes';
import authRoutes from './authRoutes';
import qrRoutes from './qrRoutes';

const router = Router();

router.use('/products', productRoutes);
router.use('/emails', emailRoutes);
router.use('/auths', authRoutes);
router.use('/qrcodes', qrRoutes);

export default router;
