import { Request, Response } from 'express';
import * as ReviewService from '../services/review.service';
import * as NotificationService from '../services/notification.service';

export async function create(req: Request, res: Response) {
    const review = await ReviewService.createReview(req.body);

    void NotificationService.createNotification({
        type: 'review_submitted',
        title: 'New review received',
        message: `New ${review.type} review from ${review.customerName} - ${review.rating} stars`,
        data: {
            reviewId: review._id.toString(),
            type: review.type,
            rating: review.rating,
            customerName: review.customerName,
        },
    });

    res.status(201).json({ message: 'Review submitted', response: review });
}

export async function list(req: Request, res: Response) {
    const { type, productId, status, page, limit } = req.query;
    const result = await ReviewService.listReviews({
        type: type as any,
        productId: productId as string,
        status: status as any,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ message: 'ok', response: result });
}

export async function updateStatus(req: Request, res: Response) {
    const review = await ReviewService.updateReviewStatus(req.params.id, req.body.status);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review status updated', response: review });
}

export async function remove(req: Request, res: Response) {
    await ReviewService.deleteReview(req.params.id);
    res.status(204).send();
}

export async function markHelpful(req: Request, res: Response) {
    const review = await ReviewService.markHelpful(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review marked as helpful', response: review });
}

export async function getStats(req: Request, res: Response) {
    const { type, productId } = req.query;
    const stats = await ReviewService.getReviewStats(type as any, productId as string);
    res.json({ message: 'ok', response: stats });
}

export default { create, list, updateStatus, remove, markHelpful, getStats };
