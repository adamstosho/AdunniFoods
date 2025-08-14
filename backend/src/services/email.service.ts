import sgMail from '@sendgrid/mail';
import config from '../config';

if (config.sendgridApiKey) {
  sgMail.setApiKey(config.sendgridApiKey);
}

export async function sendAdminNewOrderEmail(to: string, payload: { orderId: string; customerName: string; totalAmount: number }) {
  const msg = {
    to,
    from: 'no-reply@adunnifoods.com',
    subject: `New order #${payload.orderId}`,
    text: `New order from ${payload.customerName}. Total: ₦${payload.totalAmount}.`,
  };
  if (!config.sendgridApiKey) return; // noop for tests/dev without key
  await sgMail.send(msg);
}

export async function sendCustomerOrderEmail(to: string, payload: { orderId: string; whatsappUrl: string }) {
  const msg = {
    to,
    from: 'no-reply@adunnifoods.com',
    subject: `Your Adunni Foods order #${payload.orderId}`,
    text: `Thank you for your order! Please confirm via WhatsApp: ${payload.whatsappUrl}`,
  };
  if (!config.sendgridApiKey) return; // noop for tests/dev without key
  await sgMail.send(msg);
}

export default { sendAdminNewOrderEmail, sendCustomerOrderEmail };


