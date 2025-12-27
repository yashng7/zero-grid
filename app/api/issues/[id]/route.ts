import { NextRequest } from 'next/server';
import { IssueHandler } from '@/lib/handlers/issue.handler';
import { AuthMiddleware } from '@/lib/middleware/auth.middleware';

const issueHandler = new IssueHandler();
const authMiddleware = new AuthMiddleware();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return authMiddleware.authenticate(request, (req) =>
    issueHandler.getIssueById(req, id)
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return authMiddleware.authenticate(request, (req) =>
    issueHandler.updateIssue(req, id)
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return authMiddleware.authenticate(request, (req) =>
    issueHandler.deleteIssue(req, id)
  );
}