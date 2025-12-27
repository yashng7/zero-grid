import { NextRequest } from 'next/server';
import { AuthHandler } from '@/lib/handlers/auth.handler';

const authHandler = new AuthHandler();

export async function POST(request: NextRequest) {
  return authHandler.resetPassword(request);
}

export async function GET(request: NextRequest) {
  return authHandler.verifyResetToken(request);
}