import sgMail from '@sendgrid/mail';
import config from '../config';

if (config.sendgridApiKey) {
  sgMail.setApiKey(config.sendgridApiKey);
}

export async function sendAdminNewOrderEmail(
  to: string,
  payload: { orderId: string; customerName: string; totalAmount: number },
) {
  if (!config.sendgridApiKey) return;
  const msg = {
    to,
    from: config.sendgridFromEmail,
    subject: `New order #${payload.orderId}`,
    text: `New order from ${payload.customerName}. Total: ₦${payload.totalAmount}.`,
  };
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error('SendGrid Admin Error:', err);
  }
}

export async function sendCustomerOrderEmail(to: string, payload: { orderId: string; whatsappUrl: string }) {
  if (!config.sendgridApiKey) return;
  const msg = {
    to,
    from: config.sendgridFromEmail,
    subject: `Your Adunni Foods order #${payload.orderId}`,
    text: `Thank you for your order! Please confirm via WhatsApp: ${payload.whatsappUrl}`,
  };
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error('SendGrid Customer Error:', err);
  }
}

export async function sendAdminOrderStatusEmail(
  to: string,
  payload: { orderId: string; status: string; customerName: string },
) {
  if (!config.sendgridApiKey) return;
  const msg = {
    to,
    from: config.sendgridFromEmail,
    subject: `Order #${payload.orderId} status updated`,
    text: `Order for ${payload.customerName} is now ${payload.status}.`,
  };
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error('SendGrid Status Error:', err);
  }
}

export default { sendAdminNewOrderEmail, sendCustomerOrderEmail, sendAdminOrderStatusEmail };


