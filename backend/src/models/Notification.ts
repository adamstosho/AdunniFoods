import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type NotificationType = 'order_created' | 'order_status_updated' | 'low_stock' | 'product_created' | 'product_deleted';

export interface NotificationDocument extends Document {
  _id: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>({
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification: Model<NotificationDocument> =
  mongoose.models.Notification || mongoose.model<NotificationDocument>('Notification', NotificationSchema);

export default Notification;

