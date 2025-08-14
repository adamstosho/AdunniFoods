import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../src/app';
import Product from '../../src/models/Product';
import Admin from '../../src/models/Admin';
import bcrypt from 'bcryptjs';
import { signJwt } from '../../src/services/jwt.service';

let mongo: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash('secret123', 10);
  const admin = await Admin.create({ username: 'admin', passwordHash });
  token = signJwt({ sub: admin._id.toString(), username: admin.username });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Orders API', () => {
  it('creates an order and returns whatsapp url', async () => {
    const product = await Product.create({ name: 'Classic', slug: 'classic', price: 1000, images: [], stock: 10 });
    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'John Doe',
        customerPhone: '+2348000000000',
        address: 'Lagos',
        items: [{ product: product._id.toString(), name: product.name, qty: 2, price: 1000 }],
        totalAmount: 2000,
        paymentMethod: 'bank_transfer',
      });
    expect(res.status).toBe(201);
    expect(res.body.response.orderId).toBeDefined();
    expect(res.body.response.whatsappUrl).toContain('https://wa.me');
  });

  it('lists orders (admin)', async () => {
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.response)).toBe(true);
  });

  it('updates order status (admin)', async () => {
    const list = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    const id = list.body.response[0]._id;
    const res = await request(app)
      .put(`/api/orders/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Packed' });
    expect(res.status).toBe(200);
    expect(res.body.response.status).toBe('Packed');
  });
});


