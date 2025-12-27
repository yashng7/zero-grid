import { NextRequest } from 'next/server';
import { AuthHandler } from '@/lib/handlers/auth.handler';
import { AuthMiddleware } from '@/lib/middleware/auth.middleware';

const authHandler = new AuthHandler();
const authMiddleware = new AuthMiddleware();

export async function GET(request: NextRequest) {
  return authMiddleware.authenticate(request, (req) =>
    authHandler.getCurrentUser(req)
  );
}