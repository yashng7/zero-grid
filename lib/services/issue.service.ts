import { Issue } from '../db/schema';
import { IssueRepository, IIssueRepository, UserRepository } from '../repositories';
import { EmailService } from '../email';
import { NotFoundError, AuthorizationError } from '../errors';

export class IssueService {
  private issueRepository: IIssueRepository;
  private userRepository: UserRepository;
  private emailService: EmailService;

  constructor(
    issueRepository?: IIssueRepository,
    userRepository?: UserRepository,
    emailService?: EmailService
  ) {
    this.issueRepository = issueRepository || new IssueRepository();
    this.userRepository = userRepository || new UserRepository();
    this.emailService = emailService || new EmailService();
  }

  public async createIssue(
    userId: string,
    data: {
      type: string;
      title: string;
      description: string;
      priority?: string;
      status?: string;
    }
  ): Promise<Issue> {
    const issue = await this.issueRepository.create({
      ...data,
      userId,
    });

    const user = await this.userRepository.findById(userId);
    if (user) {
      this.emailService.sendIssueCreatedEmail(user.email, user.name || 'User', {
        type: issue.type,
        title: issue.title,
        description: issue.description,
      });
    }

    return issue;
  }

  public async getIssues(userId: string, type?: string): Promise<Issue[]> {
    return await this.issueRepository.findByUserId(userId, type);
  }

  public async getIssueById(userId: string, issueId: string): Promise<Issue> {
    const issue = await this.issueRepository.findById(issueId);

    if (!issue) {
      throw new NotFoundError('Issue not found');
    }

    if (issue.userId !== userId) {
      throw new AuthorizationError('Not authorized to access this issue');
    }

    return issue;
  }

  public async updateIssue(
    userId: string,
    issueId: string,
    data: Partial<Issue>
  ): Promise<Issue> {
    const issue = await this.issueRepository.findById(issueId);

    if (!issue) {
      throw new NotFoundError('Issue not found');
    }

    if (issue.userId !== userId) {
      throw new AuthorizationError('Not authorized to update this issue');
    }

    return await this.issueRepository.update(issueId, data);
  }

  public async deleteIssue(userId: string, issueId: string): Promise<void> {
    const issue = await this.issueRepository.findById(issueId);

    if (!issue) {
      throw new NotFoundError('Issue not found');
    }

    if (issue.userId !== userId) {
      throw new AuthorizationError('Not authorized to delete this issue');
    }

    await this.issueRepository.delete(issueId);
  }
}