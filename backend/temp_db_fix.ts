import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from './src/models/Settings';

dotenv.config();

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        let settings = await Settings.findOne();
        if (settings) {
            settings.accountName = "Adunni Foods and Apparel";
            settings.accountNumber = "4092107581";
            settings.bankName = "Polaris Bank";
            settings.supportEmail = "adunnifoods.ltd@gmail.com";
            await settings.save();
            console.log("Successfully updated existing Settings document!");
        } else {
            await Settings.create({});
            console.log("Created new settings document from Mongoose Defaults.");
        }
    } catch (e) {
        console.error("Error setting up DB:", e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
