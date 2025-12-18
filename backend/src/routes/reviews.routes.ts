import { Router } from 'express';
import * as ReviewsController from '../controllers/reviews.controller';
import { validate } from '../middleware/validate';
import { createReviewSchema, updateReviewStatusSchema } from '../schemas/review.schema';
import requireAuth from '../middleware/auth';

const router = Router();

// Public routes
router.post('/', validate(createReviewSchema), ReviewsController.create);
router.get('/', ReviewsController.list); // Approved reviews usually
router.get('/stats', ReviewsController.getStats);
router.post('/:id/helpful', ReviewsController.markHelpful);

// Admin routes
router.put('/:id/status', requireAuth, validate(updateReviewStatusSchema), ReviewsController.updateStatus);
router.delete('/:id', requireAuth, ReviewsController.remove);

export default router;
