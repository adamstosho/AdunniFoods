import { Request, Response } from 'express';
import * as OrderService from '../services/order.service';
import { buildWhatsAppUrl } from '../services/whatsapp.service';
import email from '../services/email.service';
import * as NotificationService from '../services/notification.service';

export async function create(req: Request, res: Response) {
  const order = await OrderService.createOrder(req.body);
  const whatsappUrl = buildWhatsAppUrl(req.body);
  // Best-effort email notifications (do not block response)
  void email.sendAdminNewOrderEmail('admin@adunnifoods.com', {
    orderId: (order._id as any).toString(),
    customerName: order.customerName,
    totalAmount: order.totalAmount,
  });
  void NotificationService.createNotification({
    type: 'order_created',
    title: 'New order received',
    message: `New order from ${order.customerName} - ₦${order.totalAmount.toFixed(2)}`,
    data: {
      orderId: (order._id as any).toString(),
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    },
  });
  res.status(201).json({ message: 'created', response: { orderId: order._id, whatsappUrl } });
}

export async function list(req: Request, res: Response) {
  const orders = await OrderService.listOrders();
  res.json({ message: 'ok', response: orders });
}

export async function getById(req: Request, res: Response) {
  const order = await OrderService.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'ok', response: order });
}

export async function track(req: Request, res: Response) {
  const { id, phone } = req.params;
  const order = await OrderService.trackOrder(id, phone);
  if (!order) return res.status(404).json({ message: 'Order not found with these details' });
  res.json({ message: 'ok', response: order });
}

export async function updateStatus(req: Request, res: Response, next: any) {
  try {
    const id = req.params.id.trim();
    const order = await OrderService.updateOrderStatus(id, req.body.status);
    if (!order) return res.status(404).json({ message: 'Not found' });

    void email.sendAdminOrderStatusEmail('admin@adunnifoods.com', {
      orderId: (order._id as any).toString(),
      status: order.status,
      customerName: order.customerName,
    });

    void NotificationService.createNotification({
      type: 'order_status_updated',
      title: 'Order status updated',
      message: `Order #${(order._id as any).toString().slice(-8).toUpperCase()} is now ${order.status}`,
      data: {
        orderId: (order._id as any).toString(),
        status: order.status,
        customerName: order.customerName,
      },
    });

    res.json({ message: 'updated', response: order });
  } catch (error) {
    next(error);
  }
}

export async function exportCsv(_req: Request, res: Response) {
  const orders = await OrderService.listOrders();
  const csv = OrderService.exportOrdersCsv(orders as any);
  res.header('Content-Type', 'text/csv');
  res.attachment('orders.csv');
  res.send(csv);
}

export default { create, list, getById, updateStatus, exportCsv };


