import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type ReviewType = 'store' | 'product';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewDocument extends Document {
    _id: Types.ObjectId;
    type: ReviewType;
    productId?: Types.ObjectId; // Only for product reviews
    customerName: string;
    customerEmail: string;
    customerLocation?: string;
    rating: number; // 1-5
    title?: string;
    comment: string;
    images?: string[];
    status: ReviewStatus;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
    {
        type: {
            type: String,
            required: true,
            enum: ['store', 'product'],
            default: 'store',
            index: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            index: true,
        },
        customerName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        customerEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        customerLocation: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            trim: true,
            maxlength: 200,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        images: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
            index: true,
        },
        isVerifiedPurchase: {
            type: Boolean,
            default: false,
        },
        helpfulCount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for common queries
ReviewSchema.index({ type: 1, status: 1 });
ReviewSchema.index({ productId: 1, status: 1 });
ReviewSchema.index({ createdAt: -1 });

const Review: Model<ReviewDocument> =
    mongoose.models.Review || mongoose.model<ReviewDocument>('Review', ReviewSchema);

export default Review;
