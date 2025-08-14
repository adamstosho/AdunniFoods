import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface AdminDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

const AdminSchema = new Schema<AdminDocument>({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Admin: Model<AdminDocument> = mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', AdminSchema);

export default Admin;


