import config from '../config';
import { OrderDocument } from '../models/Order';

export function buildWhatsAppUrl(order: Pick<OrderDocument, 'customerName' | 'customerPhone' | 'address' | 'items' | 'totalAmount' | 'paymentMethod'>) {
  const lines: string[] = [];
  lines.push(`Adunni Foods Order`);
  lines.push(`Name: ${order.customerName}`);
  lines.push(`Phone: ${order.customerPhone}`);
  lines.push(`Address: ${order.address}`);
  lines.push('Items:');
  order.items.forEach((it) => {
    lines.push(`- ${it.name} x${it.qty} — ₦${it.price * it.qty}`);
  });
  lines.push(`Total: ₦${order.totalAmount}`);
  lines.push(`Payment: ${order.paymentMethod}`);
  const message = encodeURIComponent(lines.join('\n'));
  const phone = config.whatsappPhone.replace(/[^+\d]/g, '');
  return `https://wa.me/${phone}?text=${message}`;
}

export default { buildWhatsAppUrl };



