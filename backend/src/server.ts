import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';

const port = config.port;
let server: http.Server | null = null;

async function start() {
  try {
    await mongoose.connect(config.mongodbUri);
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');

    server = app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${port}`);
    });

    const shutdown = async (signal: string) => {
      // eslint-disable-next-line no-console
      console.log(`\nReceived ${signal}, shutting down gracefully...`);
      if (server) {
        server.close(() => {
          // eslint-disable-next-line no-console
          console.log('HTTP server closed');
        });
      }
      await mongoose.connection.close();
      // eslint-disable-next-line no-console
      console.log('MongoDB connection closed');
      process.exit(0);
    };

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

void start();



