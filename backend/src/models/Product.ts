import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type ProductCategory = 'ripe_plantain_chips' | 'unripe_plantain_chips' | 'fruit_juice' | 'loaded_plantain';
export type ProductUnit = 'kg' | 'piece' | 'bottle';
export type PackagingType = 'bucket' | 'refill' | 'none';

export interface ProductDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  weight?: number; // Weight in kg (for kg-based products)
  packagingType: PackagingType;
  images: string[];
  stock: number;
  createdAt: Date;
}

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  category: {
    type: String,
    required: true,
    enum: ['ripe_plantain_chips', 'unripe_plantain_chips', 'fruit_juice', 'loaded_plantain'],
    index: true
  },
  price: { type: Number, required: true, min: 0 },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'piece', 'bottle'],
    default: 'piece'
  },
  weight: { type: Number, min: 0 }, // Optional weight in kg
  packagingType: {
    type: String,
    enum: ['bucket', 'refill', 'none'],
    default: 'none'
  },
  images: { type: [String], default: [] },
  stock: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Product: Model<ProductDocument> = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);

export default Product;


