/* eslint-disable @typescript-eslint/no-unused-vars */
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; username: string };
  }
}



