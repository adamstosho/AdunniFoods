import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as OrderService from '../services/order.service';
import { buildWhatsAppUrl } from '../services/whatsapp.service';
import email from '../services/email.service';
import * as NotificationService from '../services/notification.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderService.createOrder(req.body);
    const whatsappUrl = buildWhatsAppUrl(order);
    // Best-effort email notifications (do not block response)
    email.sendAdminNewOrderEmail('admin@adunnifoods.com', {
      orderId: (order._id as any).toString(),
      customerName: order.customerName,
      totalAmount: order.totalAmount,
    }).catch(err => console.error('Order Create Email Error:', err));

    NotificationService.createNotification({
      type: 'order_created',
      title: 'New order received',
      message: `New order from ${order.customerName} - ₦${order.totalAmount.toFixed(2)}`,
      data: {
        orderId: (order._id as any).toString(),
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      },
    }).catch(err => console.error('Order Create Notification Error:', err));
    res.status(201).json({ message: 'created', response: { orderId: order._id, whatsappUrl } });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await OrderService.listOrders();
    res.json({ message: 'ok', response: orders });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id?.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }
    const order = await OrderService.getOrderById(id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'ok', response: order });
  } catch (error) {
    next(error);
  }
}

export async function track(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id?.trim();
    const phone = req.params.phone?.trim();
    
    // Allow either a valid 24-char ObjectId OR an 8-char short ID
    const isValidFullId = mongoose.Types.ObjectId.isValid(id);
    const isValidShortId = /^[0-9a-fA-F]{8}$/.test(id);
    
    if (!isValidFullId && !isValidShortId) {
      return res.status(400).json({ message: 'Invalid order ID format. Please use the ID from your confirmation message.' });
    }
    const order = await OrderService.trackOrder(id, phone);
    if (!order) return res.status(404).json({ message: 'Order not found with these details.' });
    res.json({ message: 'ok', response: order });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id?.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }
    const order = await OrderService.updateOrderStatus(id, req.body.status);
    if (!order) return res.status(404).json({ message: 'Not found' });

    email.sendAdminOrderStatusEmail('admin@adunnifoods.com', {
      orderId: (order._id as any).toString(),
      status: order.status,
      customerName: order.customerName,
    }).catch(err => console.error('Order Status Email Error:', err));

    NotificationService.createNotification({
      type: 'order_status_updated',
      title: 'Order status updated',
      message: `Order #${(order._id as any).toString().slice(-8).toUpperCase()} is now ${order.status}`,
      data: {
        orderId: (order._id as any).toString(),
        status: order.status,
        customerName: order.customerName,
      },
    }).catch(err => console.error('Order Status Notification Error:', err));

    res.json({ message: 'updated', response: order });
  } catch (error) {
    next(error);
  }
}

export async function exportCsv(_req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await OrderService.listOrders();
    const csv = OrderService.exportOrdersCsv(orders as any);
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
}

export default { create, list, getById, track, updateStatus, exportCsv };


