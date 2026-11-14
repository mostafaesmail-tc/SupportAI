import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { DatabaseProvider } from '../db/database.provider.js';

import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { refreshTokens, users } from '../db/schema.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const [existingUser] = await this.database.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }
    const passwordHash = await argon2.hash(password);

    let user: {
      id: string;
      name: string;
      email: string;
    };

    try {
      const [createdUser] = await this.database.db
        .insert(users)
        .values({
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
        });

      user = createdUser;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505' &&
        'constraint' in error &&
        error.constraint === 'users_email_unique'
      ) {
        throw new ConflictException('Email is already registered');
      }

      throw error;
    }

    return this.createAuthResponse(user);
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await argon2.verify(user.passwordHash, password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.createAuthResponse({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }


    private hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
    }

    private async createAccessToken(user: {
    id: string;
    email: string;
    }) {
    return this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
    });
    }

    private async createAuthResponse(user: {
    id: string;
    name: string;
    email: string;
    }) {
    const refreshToken = randomBytes(32).toString('base64url');
    const tokenHash = this.hashRefreshToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.database.db.insert(refreshTokens).values({
        userId: user.id,
        tokenHash,
        expiresAt,
    });

    const accessToken = await this.createAccessToken(user);

    return {
        user,
        accessToken,
        refreshToken,
    };
    }

    async refresh(rawRefreshToken: string) {
    if (!rawRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = this.hashRefreshToken(rawRefreshToken);
    const now = new Date();

    return this.database.db.transaction(async (tx) => {
        const [storedToken] = await tx
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.tokenHash, tokenHash));

        if (
        !storedToken ||
        storedToken.revokedAt ||
        storedToken.expiresAt <= now
        ) {
        throw new UnauthorizedException('Invalid refresh token');
        }

        // Revoke the old token exactly once.
        const [revokedToken] = await tx
        .update(refreshTokens)
        .set({ revokedAt: now })
        .where(
            and(
            eq(refreshTokens.id, storedToken.id),
            isNull(refreshTokens.revokedAt),
            gt(refreshTokens.expiresAt, now),
            ),
        )
        .returning({ userId: refreshTokens.userId });

        if (!revokedToken) {
        throw new UnauthorizedException('Invalid refresh token');
        }

        const [user] = await tx
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
        })
        .from(users)
        .where(eq(users.id, revokedToken.userId));

        if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
        }

        const newRefreshToken = randomBytes(32).toString('base64url');
        const newTokenHash = this.hashRefreshToken(newRefreshToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await tx.insert(refreshTokens).values({
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt,
        });

        const accessToken = await this.createAccessToken(user);

        return {
        user,
        accessToken,
        refreshToken: newRefreshToken,
        };
    });
    }

    async logout(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) {
        return;
    }

    const tokenHash = this.hashRefreshToken(rawRefreshToken);

    await this.database.db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(
        and(
            eq(refreshTokens.tokenHash, tokenHash),
            isNull(refreshTokens.revokedAt),
        ),
        );
    }

}
