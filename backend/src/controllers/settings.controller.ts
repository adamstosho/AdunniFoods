import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';
import Settings from '../models/Settings';

export async function getProfile(req: Request, res: Response) {
  const admin = await Admin.findOne().select('username createdAt');
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json({
    message: 'ok',
    response: {
      username: admin.username,
      createdAt: admin.createdAt,
    },
  });
}

export async function updateCredentials(req: Request, res: Response) {
  const { currentPassword, newUsername, newPassword } = req.body;

  const admin = await Admin.findOne();
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

  admin.username = newUsername;
  admin.passwordHash = await bcrypt.hash(newPassword, 10);
  await admin.save();

  res.json({
    message: 'updated',
    response: {
      username: admin.username,
    },
  });
}

export async function getStoreSettings(req: Request, res: Response) {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json({ message: 'ok', response: settings });
}

export async function updateStoreSettings(req: Request, res: Response) {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  res.json({ message: 'updated', response: settings });
}

export default { getProfile, updateCredentials, getStoreSettings, updateStoreSettings };

