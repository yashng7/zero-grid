import { User } from '../db/schema';
import { UserRepository, IUserRepository } from '../repositories';
import { EmailService } from '../email';
import { NotFoundError, ValidationError } from '../errors';

export class UserService {
  private userRepository: IUserRepository;
  private emailService: EmailService;

  constructor(userRepository?: IUserRepository, emailService?: EmailService) {
    this.userRepository = userRepository || new UserRepository();
    this.emailService = emailService || new EmailService();
  }

  public async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async updateProfile(
    userId: string,
    data: { name?: string; email?: string }
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ValidationError('Email is already in use');
      }
    }

    const updatedUser = await this.userRepository.update(userId, data);

    this.emailService.sendProfileUpdatedEmail(
      updatedUser.email,
      updatedUser.name || 'User'
    );

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}