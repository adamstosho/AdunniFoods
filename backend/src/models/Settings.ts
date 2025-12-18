import mongoose, { Schema, Document, Model } from 'mongoose';

export interface SettingsDocument extends Document {
    storeName: string;
    whatsappPhone: string;
    supportEmail: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    deliveryFeeThreshold: number; // Orders above this get free delivery
    baseDeliveryFee: number;
    updatedAt: Date;
}

const SettingsSchema = new Schema<SettingsDocument>(
    {
        storeName: { type: String, default: 'Adunni Foods' },
        whatsappPhone: { type: String, default: '2347030322419' },
        supportEmail: { type: String, default: 'adunnifoods8@gmail.com' },
        bankName: { type: String, default: 'First Bank of Nigeria' },
        accountName: { type: String, default: 'Adunni Foods Ltd' },
        accountNumber: { type: String, default: '1234567890' },
        deliveryFeeThreshold: { type: Number, default: 50 },
        baseDeliveryFee: { type: Number, default: 5 },
    },
    {
        timestamps: true,
    }
);

const Settings: Model<SettingsDocument> =
    mongoose.models.Settings || mongoose.model<SettingsDocument>('Settings', SettingsSchema);

export default Settings;
