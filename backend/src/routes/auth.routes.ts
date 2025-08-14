import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);

export default router;



