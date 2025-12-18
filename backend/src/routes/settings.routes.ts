import { Router } from 'express';
import * as SettingsController from '../controllers/settings.controller';
import { validate } from '../middleware/validate';
import { updateAdminCredentialsSchema, updateStoreSettingsSchema } from '../schemas/settings.schema';
import requireAuth from '../middleware/auth';

const router = Router();

// Admin profile
router.get('/profile', requireAuth, SettingsController.getProfile);
router.put('/credentials', requireAuth, validate(updateAdminCredentialsSchema), SettingsController.updateCredentials);

// Store settings
router.get('/store', SettingsController.getStoreSettings); // Public to fetch phone/bank
router.put('/store', requireAuth, validate(updateStoreSettingsSchema), SettingsController.updateStoreSettings);

export default router;

