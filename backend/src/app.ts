import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import router from './routes';
import config from './config';

const app = express();

app.use(helmet());

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://adunnifoods.vercel.app',
      config.clientOrigin
    ].filter(Boolean);

    if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin + '/') || config.clientOrigin === '*') {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use(limiter);

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to Adunni Foods API',
    status: 'running',
    docs: '/api-docs',
    health: '/health'
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger UI Setup
try {
  const swaggerDocument = yaml.load(
    fs.readFileSync(path.join(__dirname, '../openapi.yaml'), 'utf8')
  ) as any;
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Adunni Foods API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true
    }
  }));
  console.log('✅ Swagger UI available at /api-docs');

  // Serve OpenAPI spec directly
  app.get('/openapi.yaml', (_req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.send(fs.readFileSync(path.join(__dirname, '../openapi.yaml'), 'utf8'));
  });
  console.log('✅ OpenAPI spec available at /openapi.yaml');
} catch (error) {
  console.error('❌ Error loading Swagger documentation:', error);
}

app.use('/api', router);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;



