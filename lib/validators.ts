import { ValidationError } from './errors';

export interface IValidator {
  validate(data: any): void;
}

export class RegisterValidator implements IValidator {
  validate(data: any): void {
    const { email, password, name } = data;

    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (!password || typeof password !== 'string') {
      throw new ValidationError('Password is required');
    }

    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    if (!name || typeof name !== 'string') {
      throw new ValidationError('Name is required');
    }

    if (name.length < 2) {
      throw new ValidationError('Name must be at least 2 characters');
    }
  }
}

export class LoginValidator implements IValidator {
  validate(data: any): void {
    const { email, password } = data;

    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email is required');
    }

    if (!password || typeof password !== 'string') {
      throw new ValidationError('Password is required');
    }
  }
}

export class IssueValidator implements IValidator {
  private validTypes = ['cloud-security', 'reteam-assessment', 'vapt'];
  private validPriorities = ['low', 'medium', 'high'];
  private validStatuses = ['open', 'in-progress', 'closed'];

  validate(data: any): void {
    const { type, title, description } = data;

    if (!type || typeof type !== 'string') {
      throw new ValidationError('Issue type is required');
    }

    if (!this.validTypes.includes(type)) {
      throw new ValidationError(`Invalid issue type. Must be one of: ${this.validTypes.join(', ')}`);
    }

    if (!title || typeof title !== 'string') {
      throw new ValidationError('Title is required');
    }

    if (title.length < 3) {
      throw new ValidationError('Title must be at least 3 characters');
    }

    if (!description || typeof description !== 'string') {
      throw new ValidationError('Description is required');
    }

    if (description.length < 10) {
      throw new ValidationError('Description must be at least 10 characters');
    }

    if (data.priority && !this.validPriorities.includes(data.priority)) {
      throw new ValidationError(`Invalid priority. Must be one of: ${this.validPriorities.join(', ')}`);
    }

    if (data.status && !this.validStatuses.includes(data.status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${this.validStatuses.join(', ')}`);
    }
  }
}

export class ProfileValidator implements IValidator {
  validate(data: any): void {
    const { name, email } = data;

    if (name !== undefined && (typeof name !== 'string' || name.length < 1)) {
      throw new ValidationError('Name must be a non-empty string');
    }

    if (email !== undefined) {
      if (typeof email !== 'string') {
        throw new ValidationError('Email must be a string');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format');
      }
    }
  }
}

export class ForgotPasswordValidator implements IValidator {
  validate(data: any): void {
    const { email } = data;

    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }
  }
}

export class ResetPasswordValidator implements IValidator {
  validate(data: any): void {
    const { token, password, confirmPassword } = data;

    if (!token || typeof token !== 'string') {
      throw new ValidationError('Reset token is required');
    }

    if (!password || typeof password !== 'string') {
      throw new ValidationError('Password is required');
    }

    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    if (password !== confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }
  }
}