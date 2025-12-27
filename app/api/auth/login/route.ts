import { NextRequest } from 'next/server';
import { AuthHandler } from '@/lib/handlers/auth.handler';

const authHandler = new AuthHandler();

export async function POST(request: NextRequest) {
  return authHandler.login(request);
}