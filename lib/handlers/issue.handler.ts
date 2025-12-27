import { NextRequest, NextResponse } from "next/server";
import { IssueService } from "../services/issue.service";
import { IssueValidator } from "../validators";
import { RateLimiter } from "../rate-limiter";
import { AppError } from "../errors";

export class IssueHandler {
  private issueService: IssueService;
  private issueValidator: IssueValidator;
  private rateLimiter: RateLimiter;

  constructor() {
    this.issueService = new IssueService();
    this.issueValidator = new IssueValidator();
    this.rateLimiter = new RateLimiter();
  }

  public async getIssues(request: NextRequest): Promise<NextResponse> {
    try {
      const userId = (request as any).userId;
      const { searchParams } = new URL(request.url);
      const type = searchParams.get("type") || undefined;

      const rateLimitResult = await this.rateLimiter.checkLimit(
        `issues:${userId}`
      );

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          { success: false, error: "Rate limit exceeded" },
          { status: 429 }
        );
        response.headers.set(
          "X-RateLimit-Limit",
          rateLimitResult.limit.toString()
        );
        response.headers.set(
          "X-RateLimit-Remaining",
          rateLimitResult.remaining.toString()
        );
        response.headers.set(
          "X-RateLimit-Reset",
          rateLimitResult.reset.toISOString()
        );
        return response;
      }

      const issues = await this.issueService.getIssues(userId, type);

      const response = NextResponse.json({
        success: true,
        data: issues,
      });

      response.headers.set(
        "X-RateLimit-Limit",
        rateLimitResult.limit.toString()
      );
      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimitResult.remaining.toString()
      );
      response.headers.set(
        "X-RateLimit-Reset",
        rateLimitResult.reset.toISOString()
      );

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async createIssue(request: NextRequest): Promise<NextResponse> {
    try {
      const userId = (request as any).userId;

      const rateLimitResult = await this.rateLimiter.checkLimit(
        `create-issue:${userId}`
      );

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          { success: false, error: "Rate limit exceeded" },
          { status: 429 }
        );
        response.headers.set(
          "X-RateLimit-Limit",
          rateLimitResult.limit.toString()
        );
        response.headers.set(
          "X-RateLimit-Remaining",
          rateLimitResult.remaining.toString()
        );
        response.headers.set(
          "X-RateLimit-Reset",
          rateLimitResult.reset.toISOString()
        );
        return response;
      }

      const body = await request.json();

      this.issueValidator.validate(body);

      const issue = await this.issueService.createIssue(userId, body);

      const response = NextResponse.json(
        {
          success: true,
          data: issue,
        },
        { status: 201 }
      );

      response.headers.set(
        "X-RateLimit-Limit",
        rateLimitResult.limit.toString()
      );
      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimitResult.remaining.toString()
      );
      response.headers.set(
        "X-RateLimit-Reset",
        rateLimitResult.reset.toISOString()
      );

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async getIssueById(
    request: NextRequest,
    id: string // Now just a string
  ): Promise<NextResponse> {
    try {
      const userId = (request as any).userId;

      const rateLimitResult = await this.rateLimiter.checkLimit(
        `issue:${userId}`
      );

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          { success: false, error: "Rate limit exceeded" },
          { status: 429 }
        );
        response.headers.set(
          "X-RateLimit-Limit",
          rateLimitResult.limit.toString()
        );
        response.headers.set(
          "X-RateLimit-Remaining",
          rateLimitResult.remaining.toString()
        );
        response.headers.set(
          "X-RateLimit-Reset",
          rateLimitResult.reset.toISOString()
        );
        return response;
      }

      const issue = await this.issueService.getIssueById(userId, id);

      const response = NextResponse.json({
        success: true,
        data: issue,
      });

      response.headers.set(
        "X-RateLimit-Limit",
        rateLimitResult.limit.toString()
      );
      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimitResult.remaining.toString()
      );
      response.headers.set(
        "X-RateLimit-Reset",
        rateLimitResult.reset.toISOString()
      );

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async updateIssue(
    request: NextRequest,
    id: string // Now just a string
  ): Promise<NextResponse> {
    try {
      const userId = (request as any).userId;

      const rateLimitResult = await this.rateLimiter.checkLimit(
        `update-issue:${userId}`
      );

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          { success: false, error: "Rate limit exceeded" },
          { status: 429 }
        );
        response.headers.set(
          "X-RateLimit-Limit",
          rateLimitResult.limit.toString()
        );
        response.headers.set(
          "X-RateLimit-Remaining",
          rateLimitResult.remaining.toString()
        );
        response.headers.set(
          "X-RateLimit-Reset",
          rateLimitResult.reset.toISOString()
        );
        return response;
      }

      const body = await request.json();

      const issue = await this.issueService.updateIssue(userId, id, body);

      const response = NextResponse.json({
        success: true,
        data: issue,
      });

      response.headers.set(
        "X-RateLimit-Limit",
        rateLimitResult.limit.toString()
      );
      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimitResult.remaining.toString()
      );
      response.headers.set(
        "X-RateLimit-Reset",
        rateLimitResult.reset.toISOString()
      );

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async deleteIssue(
    request: NextRequest,
    id: string 
  ): Promise<NextResponse> {
    try {
      const userId = (request as any).userId;

      const rateLimitResult = await this.rateLimiter.checkLimit(
        `delete-issue:${userId}`
      );

      if (!rateLimitResult.allowed) {
        const response = NextResponse.json(
          { success: false, error: "Rate limit exceeded" },
          { status: 429 }
        );
        response.headers.set(
          "X-RateLimit-Limit",
          rateLimitResult.limit.toString()
        );
        response.headers.set(
          "X-RateLimit-Remaining",
          rateLimitResult.remaining.toString()
        );
        response.headers.set(
          "X-RateLimit-Reset",
          rateLimitResult.reset.toISOString()
        );
        return response;
      }

      await this.issueService.deleteIssue(userId, id);

      const response = NextResponse.json({
        success: true,
        message: "Issue deleted successfully",
      });

      response.headers.set(
        "X-RateLimit-Limit",
        rateLimitResult.limit.toString()
      );
      response.headers.set(
        "X-RateLimit-Remaining",
        rateLimitResult.remaining.toString()
      );
      response.headers.set(
        "X-RateLimit-Reset",
        rateLimitResult.reset.toISOString()
      );

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

    console.error("Unhandled error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
