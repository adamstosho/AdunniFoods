import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type OrderStatus = 'Pending' | 'Packed' | 'Out for Delivery' | 'Completed';
export type PaymentMethod = 'bank_transfer' | 'mobile_money' | 'cash_on_delivery';

export interface OrderItem {
  product: Types.ObjectId;
  name: string;
  qty: number;
  price: number;
}

export interface OrderDocument extends Document {
  _id: Types.ObjectId;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const OrderSchema = new Schema<OrderDocument>({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  address: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true, validate: (v: OrderItem[]) => v.length > 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['bank_transfer', 'mobile_money', 'cash_on_delivery'], required: true },
  status: { type: String, enum: ['Pending', 'Packed', 'Out for Delivery', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order: Model<OrderDocument> = mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema);

export default Order;


