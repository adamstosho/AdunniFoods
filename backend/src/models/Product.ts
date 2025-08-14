import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ProductDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  price: number;
  images: string[];
  stock: number;
  createdAt: Date;
}

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  images: { type: [String], default: [] },
  stock: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Product: Model<ProductDocument> = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);

export default Product;


