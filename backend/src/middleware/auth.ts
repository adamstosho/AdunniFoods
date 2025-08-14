import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export interface JwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    (req as any).user = { id: decoded.sub, username: decoded.username };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export default requireAuth;



