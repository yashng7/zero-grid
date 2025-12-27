import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/auth.service';
import {
  RegisterValidator,
  LoginValidator,
  ForgotPasswordValidator,
  ResetPasswordValidator,
} from '../validators';
import { RateLimiter } from '../rate-limiter';
import { AppError } from '../errors';

export class AuthHandler {
  private authService: AuthService;
  private registerValidator: RegisterValidator;
  private loginValidator: LoginValidator;
  private forgotPasswordValidator: ForgotPasswordValidator;
  private resetPasswordValidator: ResetPasswordValidator;
  private rateLimiter: RateLimiter;

  constructor() {
    this.authService = new AuthService();
    this.registerValidator = new RegisterValidator();
    this.loginValidator = new LoginValidator();
    this.forgotPasswordValidator = new ForgotPasswordValidator();
    this.resetPasswordValidator = new ResetPasswordValidator();
    this.rateLimiter = new RateLimiter();
  }

  public async register(request: NextRequest): Promise<NextResponse> {
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const rateLimitResult = await this.rateLimiter.checkLimit(`register:${ip}`);

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
      this.registerValidator.validate(body);

      const result = await this.authService.register(body);

      const response = NextResponse.json(
        {
          success: true,
          data: result,
        },
        { status: 201 }
      );

      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());

      response.cookies.set('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60,
        path: '/',
      });

      response.cookies.set('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    } catch (error) {
      console.error('Register error:', error);
      return this.handleError(error);
    }
  }

  public async login(request: NextRequest): Promise<NextResponse> {
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const rateLimitResult = await this.rateLimiter.checkLimit(`login:${ip}`);

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
      this.loginValidator.validate(body);

      const result = await this.authService.login(body);

      const response = NextResponse.json({
        success: true,
        data: result,
      });

      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());

      response.cookies.set('accessToken', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60,
        path: '/',
      });

      response.cookies.set('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return this.handleError(error);
    }
  }

  public async logout(request: NextRequest): Promise<NextResponse> {
    try {
      const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully',
      });

      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async getCurrentUser(request: NextRequest): Promise<NextResponse> {
    try {
      const userId = (request as any).userId;

      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'Not authenticated' },
          { status: 401 }
        );
      }

      const user = await this.authService.getCurrentUser(userId);

      return NextResponse.json({
        success: true,
        data: user,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async forgotPassword(request: NextRequest): Promise<NextResponse> {
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';

      // Strict rate limiting: 3 requests per 15 minutes
      const rateLimitResult = await this.rateLimiter.checkLimit(`forgot-password:${ip}`, {
        maxRequests: 3,
        windowMs: 15 * 60 * 1000,
      });

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          { success: false, error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());
        return response;
      }

      const body = await request.json();
      this.forgotPasswordValidator.validate(body);

      await this.authService.forgotPassword(body.email);

      // Always return success to prevent email enumeration
      const response = NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });

      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());

      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      return this.handleError(error);
    }
  }

  public async resetPassword(request: NextRequest): Promise<NextResponse> {
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';

      const rateLimitResult = await this.rateLimiter.checkLimit(`reset-password:${ip}`, {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000,
      });

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          { success: false, error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());
        return response;
      }

      const body = await request.json();
      this.resetPasswordValidator.validate(body);

      await this.authService.resetPassword(body.token, body.password);

      const response = NextResponse.json({
        success: true,
        message: 'Password has been reset successfully.',
      });

      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toISOString());

      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      return this.handleError(error);
    }
  }

  public async verifyResetToken(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const token = searchParams.get('token');

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Token is required' },
          { status: 400 }
        );
      }

      const isValid = await this.authService.verifyResetToken(token);

      return NextResponse.json({
        success: true,
        data: { valid: isValid },
      });
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