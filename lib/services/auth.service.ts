import bcrypt from 'bcryptjs';
import { User } from '../db/schema';
import { UserRepository, PasswordResetRepository, IUserRepository } from '../repositories';
import { JWTService } from '../jwt';
import { EmailService } from '../email';
import { AuthenticationError, ValidationError } from '../errors';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  tokens: AuthTokens;
}

export class AuthService {
  private userRepository: UserRepository;
  private passwordResetRepository: PasswordResetRepository;
  private jwtService: JWTService;
  private emailService: EmailService;

  constructor(
    userRepository?: UserRepository,
    jwtService?: JWTService,
    emailService?: EmailService
  ) {
    this.userRepository = userRepository || new UserRepository();
    this.passwordResetRepository = new PasswordResetRepository();
    this.jwtService = jwtService || new JWTService();
    this.emailService = emailService || new EmailService();
  }

  public async register(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      name: data.name,
    });

    const tokens = this.generateTokens(user);

    this.emailService.sendWelcomeEmail(user.email, user.name || 'User');

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  public async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(data.email.toLowerCase());
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    const tokens = this.generateTokens(user);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  public async getCurrentUser(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return;
    }

    await this.passwordResetRepository.deleteUserTokens(user.id);

    const token = this.generateSecureToken();

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.passwordResetRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });

    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.name || 'Operative',
      token
    );
  }

  public async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await this.passwordResetRepository.findValidToken(token);

    if (!resetToken) {
      throw new ValidationError('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updatePassword(resetToken.userId, hashedPassword);

    await this.passwordResetRepository.markAsUsed(resetToken.id);

    await this.passwordResetRepository.deleteUserTokens(resetToken.userId);

    await this.emailService.sendPasswordChangedEmail(
      resetToken.user.email,
      resetToken.user.name || 'Operative'
    );
  }

  public async verifyResetToken(token: string): Promise<boolean> {
    const resetToken = await this.passwordResetRepository.findValidToken(token);
    return resetToken !== null;
  }

  private generateTokens(user: User): AuthTokens {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.generateAccessToken(payload),
      refreshToken: this.jwtService.generateRefreshToken(payload),
    };
  }

  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}