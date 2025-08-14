import dotenv from 'dotenv';

dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: getEnv('MONGODB_URI'),
  jwtSecret: getEnv('JWT_SECRET'),
  sendgridApiKey: getEnv('SENDGRID_API_KEY'),
  whatsappPhone: getEnv('WHATSAPP_PHONE'),
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
};

export type AppConfig = typeof config;

export default config;



