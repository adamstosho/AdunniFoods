import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

export async function login(req: Request, res: Response) {
  const result = await AuthService.loginAdmin(req.body.username, req.body.password);
  if (!result) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'ok', response: result });
}

export async function register(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await AuthService.checkAdminExists(username);
    if (existingAdmin) {
      return res.status(409).json({ 
        message: 'Admin user already exists with this username' 
      });
    }
    
    // Create new admin
    const newAdmin = await AuthService.createAdmin(username, password);
    
    res.status(201).json({ 
      message: 'Admin user created successfully',
      response: { username: newAdmin.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to create admin user' });
  }
}

export default { login, register };



