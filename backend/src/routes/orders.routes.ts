import { Router } from 'express';
import * as OrdersController from '../controllers/orders.controller';
import { validate } from '../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../schemas/order.schema';
import requireAuth from '../middleware/auth';

const router = Router();

// Public create
router.post('/', validate(createOrderSchema), OrdersController.create);

// Admin endpoints (place static route before dynamic :id)
router.get('/export/csv', requireAuth, OrdersController.exportCsv);
router.get('/', requireAuth, OrdersController.list);
router.get('/:id', requireAuth, OrdersController.getById);
router.put('/:id', requireAuth, validate(updateOrderStatusSchema), OrdersController.updateStatus);

export default router;


