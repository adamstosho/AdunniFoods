import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './products.routes';
import orderRoutes from './orders.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Adunni Foods API' });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);

export default router;


