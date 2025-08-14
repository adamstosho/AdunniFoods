import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import config from '../config';

export function signJwt(payload: { sub: string; username: string }, expiresIn: number | string = '1h') {
  const secret: Secret = config.jwtSecret as unknown as Secret;
  const options: SignOptions = {};
  (options as any).expiresIn = expiresIn as any;
  return jwt.sign(payload, secret, options);
}

export default { signJwt };


