import jwt, { type SignOptions } from 'jsonwebtoken';
import { AuthenticationError } from './errors';

export interface JWTPayload {
  userId: string;
  email: string;
}

export class JWTService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET ?? 'fallback-secret-dev-only';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-dev-only';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY ?? '1h';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY ?? '7d';
  }

  public generateAccessToken(payload: JWTPayload): string {
    const options: SignOptions = {
      expiresIn: this.accessTokenExpiry as any, // safe known issue jwt v9+, i control value
    };
    return jwt.sign(payload, this.accessTokenSecret, options);
  }

  public generateRefreshToken(payload: JWTPayload): string {
    const options: SignOptions = {
      expiresIn: this.refreshTokenExpiry as any, 
    };
    return jwt.sign(payload, this.refreshTokenSecret, options);
  }

  public verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.accessTokenSecret) as JWTPayload;
    } catch {
      throw new AuthenticationError('Invalid or expired access token');
    }
  }

  public verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as JWTPayload;
    } catch {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  public decodeToken(token: string): JWTPayload | null {
    return jwt.decode(token) as JWTPayload | null;
  }
}