import { NextRequest, NextResponse } from 'next/server';
import { JWTService } from '../jwt';

export class AuthMiddleware {
  private jwtService: JWTService;

  constructor() {
    this.jwtService = new JWTService();
  }

  public async authenticate(
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      const token = request.cookies.get('accessToken')?.value;

      if (!token) {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication required',
          },
          { status: 401 }
        );
      }

      const payload = this.jwtService.verifyAccessToken(token);

      (request as any).userId = payload.userId;
      (request as any).userEmail = payload.email;

      return await handler(request);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }
  }
}