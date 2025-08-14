import { Router } from 'express';
import * as ProductsController from '../controllers/products.controller';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import requireAuth from '../middleware/auth';

const router = Router();

router.get('/', ProductsController.list);
router.get('/:id', ProductsController.getById);
router.post('/', requireAuth, validate(createProductSchema), ProductsController.create);
router.put('/:id', requireAuth, validate(updateProductSchema), ProductsController.update);
router.delete('/:id', requireAuth, ProductsController.remove);

export default router;



