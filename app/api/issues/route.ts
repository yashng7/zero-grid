import { NextRequest } from 'next/server';
import { IssueHandler } from '@/lib/handlers/issue.handler';
import { AuthMiddleware } from '@/lib/middleware/auth.middleware';

const issueHandler = new IssueHandler();
const authMiddleware = new AuthMiddleware();

export async function GET(request: NextRequest) {
  return authMiddleware.authenticate(request, (req) =>
    issueHandler.getIssues(req)
  );
}

export async function POST(request: NextRequest) {
  return authMiddleware.authenticate(request, (req) =>
    issueHandler.createIssue(req)
  );
}