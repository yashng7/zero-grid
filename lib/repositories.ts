import { db } from "./db";
import {
  users,
  issues,
  passwordResetTokens,
  User,
  NewUser,
  Issue,
  NewIssue,
  PasswordResetToken,
} from "./db/schema";
import { eq, and, desc, gt, lt, isNull } from "drizzle-orm";

export interface IUserRepository {
  create(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  update(id: string, data: Partial<User>): Promise<User>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
}

export interface IIssueRepository {
  create(data: {
    type: string;
    title: string;
    description: string;
    priority?: string;
    status?: string;
    userId: string;
  }): Promise<Issue>;
  findById(id: string): Promise<Issue | undefined>;
  findByUserId(userId: string, type?: string): Promise<Issue[]>;
  update(id: string, data: Partial<Issue>): Promise<Issue>;
  delete(id: string): Promise<void>;
}

export interface IPasswordResetRepository {
  create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<PasswordResetToken>;
  findValidToken(
    token: string
  ): Promise<(PasswordResetToken & { user: User }) | null>;
  markAsUsed(id: string): Promise<void>;
  deleteUserTokens(userId: string): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}

export class UserRepository implements IUserRepository {
  public async create(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  public async updatePassword(
    id: string,
    hashedPassword: string
  ): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, id));
  }
}

export class IssueRepository implements IIssueRepository {
  public async create(data: {
    type: string;
    title: string;
    description: string;
    priority?: string;
    status?: string;
    userId: string;
  }): Promise<Issue> {
    const [issue] = await db
      .insert(issues)
      .values({
        type: data.type,
        title: data.title,
        description: data.description,
        priority: data.priority || "medium",
        status: data.status || "open",
        userId: data.userId,
      })
      .returning();
    return issue;
  }

  public async findById(id: string): Promise<Issue | undefined> {
    const [issue] = await db.select().from(issues).where(eq(issues.id, id));
    return issue;
  }

  public async findByUserId(userId: string, type?: string): Promise<Issue[]> {
    if (type) {
      return await db
        .select()
        .from(issues)
        .where(and(eq(issues.userId, userId), eq(issues.type, type)))
        .orderBy(desc(issues.createdAt));
    }
    return await db
      .select()
      .from(issues)
      .where(eq(issues.userId, userId))
      .orderBy(desc(issues.createdAt));
  }

  public async update(id: string, data: Partial<Issue>): Promise<Issue> {
    const [issue] = await db
      .update(issues)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(issues.id, id))
      .returning();
    return issue;
  }

  public async delete(id: string): Promise<void> {
    await db.delete(issues).where(eq(issues.id, id));
  }
}

export class PasswordResetRepository implements IPasswordResetRepository {
  public async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<PasswordResetToken> {
    const [resetToken] = await db
      .insert(passwordResetTokens)
      .values(data)
      .returning();
    return resetToken;
  }

  public async findValidToken(
    token: string
  ): Promise<(PasswordResetToken & { user: User }) | null> {
    const result = await db
      .select({
        resetToken: passwordResetTokens,
        user: users,
      })
      .from(passwordResetTokens)
      .innerJoin(users, eq(passwordResetTokens.userId, users.id))
      .where(
        and(
          eq(passwordResetTokens.token, token),
          gt(passwordResetTokens.expiresAt, new Date()),
          isNull(passwordResetTokens.usedAt)
        )
      )
      .limit(1);

    if (result.length === 0) return null;

    return {
      ...result[0].resetToken,
      user: result[0].user,
    };
  }

  public async markAsUsed(id: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, id));
  }

  public async deleteUserTokens(userId: string): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));
  }

  public async deleteExpiredTokens(): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(lt(passwordResetTokens.expiresAt, new Date()));
  }
}
