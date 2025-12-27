import { NextRequest } from 'next/server';
import { UserHandler } from '@/lib/handlers/user.handler';
import { AuthMiddleware } from '@/lib/middleware/auth.middleware';

const userHandler = new UserHandler();
const authMiddleware = new AuthMiddleware();

export async function GET(request: NextRequest) {
  return authMiddleware.authenticate(request, (req) =>
    userHandler.getProfile(req)
  );
}

export async function PUT(request: NextRequest) {
  return authMiddleware.authenticate(request, (req) =>
    userHandler.updateProfile(req)
  );
}