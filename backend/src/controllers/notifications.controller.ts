import { Request, Response } from 'express';
import * as NotificationService from '../services/notification.service';

export async function list(req: Request, res: Response) {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const notifications = await NotificationService.listNotifications(limit);
  res.json({ message: 'ok', response: notifications });
}

export async function markAsRead(req: Request, res: Response) {
  const notification = await NotificationService.markAsRead(req.params.id);
  if (!notification) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'updated', response: notification });
}

export async function markAllAsRead(_req: Request, res: Response) {
  await NotificationService.markAllAsRead();
  res.json({ message: 'updated' });
}

export default { list, markAsRead, markAllAsRead };

