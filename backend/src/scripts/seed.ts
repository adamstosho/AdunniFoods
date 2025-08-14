import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
import Product from '../models/Product';
import bcrypt from 'bcryptjs';

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI as string;
  if (!uri) throw new Error('MONGODB_URI missing');
  await mongoose.connect(uri);
  // Seed admin
  const username = 'admin';
  const password = 'admin1234';
  const existing = await Admin.findOne({ username });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });
    // eslint-disable-next-line no-console
    console.log('Seeded admin: admin/admin1234');
  }
  // Seed a sample product
  const sample = await Product.findOne({ slug: 'classic-plantain-chips' });
  if (!sample) {
    await Product.create({
      name: 'Classic Plantain Chips',
      slug: 'classic-plantain-chips',
      description: 'Crunchy, authentic plantain chips',
      price: 1000,
      images: [],
      stock: 100,
    });
    // eslint-disable-next-line no-console
    console.log('Seeded sample product');
  }
  await mongoose.disconnect();
}

void run().then(() => {
  // eslint-disable-next-line no-console
  console.log('Seeding complete');
  process.exit(0);
});



