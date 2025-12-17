import Notification, { NotificationDocument, NotificationType } from '../models/Notification';

export async function createNotification(payload: {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}) {
  const notification = await Notification.create({
    type: payload.type,
    title: payload.title,
    message: payload.message,
    data: payload.data,
  });
  return notification;
}

export async function listNotifications(limit = 20) {
  return Notification.find().sort({ createdAt: -1 }).limit(limit);
}

export async function markAsRead(id: string) {
  return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
}

export async function markAllAsRead() {
  await Notification.updateMany({ read: false }, { read: true });
}

export default { createNotification, listNotifications, markAsRead, markAllAsRead };

