import { Router } from 'express';
import * as SettingsController from '../controllers/settings.controller';
import { validate } from '../middleware/validate';
import { updateAdminCredentialsSchema } from '../schemas/settings.schema';

const router = Router();

router.get('/profile', SettingsController.getProfile);
router.put('/credentials', validate(updateAdminCredentialsSchema), SettingsController.updateCredentials);

export default router;

