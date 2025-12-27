import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../services/user.service';
import { ProfileValidator } from '../validators';
import { RateLimiter } from '../rate-limiter';
import { AppError } from '../errors';

export class UserHandler {
  private userService: UserService;
  private profileValidator: ProfileValidator;
  private rateLimiter: RateLimiter;

  constructor() {
    this.userService = new UserService();
    this.profileValidator = new ProfileValidator();
    this.rateLimiter = new RateLimiter();
  }

  public async getProfile(request: NextRequest): Promise<NextResponse> {
    try {
      const userId = (request as any).userId;

      const rateLimitResult = await this.rateLimiter.checkLimit(`profile:${userId}`);

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          { success: false, error: 'Rate limit exceeded' },
          { status: 429 }
        );
        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());
        return response;
      }

      const user = await this.userService.getProfile(userId);

      const response = NextResponse.json({
        success: true,
        data: user,
      });

      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async updateProfile(request: NextRequest): Promise<NextResponse> {
    try {
      const userId = (request as any).userId;

      const rateLimitResult = await this.rateLimiter.checkLimit(`update-profile:${userId}`);

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          { success: false, error: 'Rate limit exceeded' },
          { status: 429 }
        );
        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());
        return response;
      }

      const body = await request.json();

      this.profileValidator.validate(body);

      const user = await this.userService.updateProfile(userId, body);

      const response = NextResponse.json({
        success: true,
        data: user,
      });

      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): NextResponse {
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.statusCode }
      );
    }

    console.error('Unhandled error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}