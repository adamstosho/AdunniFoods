import { Router } from 'express';
import multer from 'multer';
import * as UploadController from '../controllers/upload.controller';
import requireAuth from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/', requireAuth, upload.single('file'), UploadController.uploadImage);

export default router;



