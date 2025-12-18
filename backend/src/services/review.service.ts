import Review, { ReviewDocument, ReviewType, ReviewStatus } from '../models/Review';
import { FilterQuery } from 'mongoose';

export async function createReview(data: Partial<ReviewDocument>) {
    return Review.create(data);
}

export async function listReviews(params: {
    type?: ReviewType;
    productId?: string;
    status?: ReviewStatus;
    page?: number;
    limit?: number;
}) {
    const { type, productId, status, page = 1, limit = 10 } = params;
    const query: FilterQuery<ReviewDocument> = {};

    if (type) query.type = type;
    if (productId) query.productId = productId as any;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Review.countDocuments(query),
    ]);

    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function updateReviewStatus(id: string, status: ReviewStatus) {
    return Review.findByIdAndUpdate(id, { status }, { new: true });
}

export async function deleteReview(id: string) {
    return Review.findByIdAndDelete(id);
}

export async function markHelpful(id: string) {
    return Review.findByIdAndUpdate(id, { $inc: { helpfulCount: 1 } }, { new: true });
}

export async function getReviewStats(type: ReviewType, productId?: string) {
    const query: FilterQuery<ReviewDocument> = { status: 'approved', type };
    if (productId) query.productId = productId as any;

    const stats = await Review.aggregate([
        { $match: query },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
                ratingDistribution: {
                    $push: '$rating',
                },
            },
        },
    ]);

    if (stats.length === 0) {
        return { averageRating: 0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }

    const distribution = stats[0].ratingDistribution.reduce(
        (acc: any, rating: number) => {
            acc[rating] = (acc[rating] || 0) + 1;
            return acc;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );

    return {
        averageRating: stats[0].averageRating,
        totalReviews: stats[0].totalReviews,
        distribution,
    };
}

export default {
    createReview,
    listReviews,
    updateReviewStatus,
    deleteReview,
    markHelpful,
    getReviewStats,
};
