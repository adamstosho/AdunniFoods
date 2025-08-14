import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

export async function login(req: Request, res: Response) {
  const result = await AuthService.loginAdmin(req.body.username, req.body.password);
  if (!result) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'ok', response: result });
}

export default { login };



