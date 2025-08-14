import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../src/app';
import Admin from '../../src/models/Admin';
import { signJwt } from '../../src/services/jwt.service';
import bcrypt from 'bcryptjs';

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

describe('Products API', () => {
  it('lists empty products initially', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.response).toHaveLength(0);
  });

  it('creates a product (admin)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Classic Chips', slug: 'classic-chips', price: 1000, images: [], stock: 10 });
    expect(res.status).toBe(201);
    expect(res.body.response.name).toBe('Classic Chips');
  });

  it('gets product by id', async () => {
    const list = await request(app).get('/api/products');
    const id = list.body.response[0]._id;
    const res = await request(app).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.response._id).toBe(id);
  });
});



