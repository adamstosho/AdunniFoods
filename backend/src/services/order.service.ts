// json2csv lacks bundled types in versions we use; import via require type
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Parser } = require('json2csv');
import Order, { OrderDocument } from '../models/Order';

export async function createOrder(data: Partial<OrderDocument>) {
  return Order.create(data);
}

export async function listOrders() {
  return Order.find().sort({ createdAt: -1 });
}

export async function getOrderById(id: string) {
  return Order.findById(id);
}

export async function updateOrderStatus(id: string, status: OrderDocument['status']) {
  return Order.findByIdAndUpdate(id, { status }, { new: true });
}

export async function trackOrder(id: string, phone: string) {
  return Order.findOne({ _id: id, customerPhone: phone });
}

export function exportOrdersCsv(orders: OrderDocument[]) {
  const fields = ['_id', 'customerName', 'customerPhone', 'address', 'totalAmount', 'paymentMethod', 'status', 'createdAt'];
  const parser = new Parser({ fields });
  return parser.parse(orders.map(o => o.toObject()));
}

export default { createOrder, listOrders, getOrderById, updateOrderStatus, exportOrdersCsv };


