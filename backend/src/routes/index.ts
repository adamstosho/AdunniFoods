import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './products.routes';
import orderRoutes from './orders.routes';
import uploadRoutes from './upload.routes';
import notificationRoutes from './notifications.routes';
import settingsRoutes from './settings.routes';
import reviewRoutes from './reviews.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Adunni Foods API' });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);
router.use('/reviews', reviewRoutes);

export default router;


