import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import { signJwt } from './jwt.service';

export async function loginAdmin(username: string, password: string) {
  const admin = await Admin.findOne({ username });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  const token = signJwt({ sub: (admin._id as any).toString(), username: admin.username });
  return { token };
}

export async function checkAdminExists(username: string) {
  const existing = await Admin.findOne({ username });
  return existing;
}

export async function createAdmin(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ username, passwordHash });
  return admin;
}

export default { loginAdmin, createAdmin, checkAdminExists };


