import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { DatabaseProvider } from '../db/database.provider.js';
import * as argon2 from 'argon2';
import { refreshTokens, users } from '../db/schema.js';

describe('AuthService', () => {
  let service: AuthService;

  const database = {
    db: {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      transaction: vi.fn(),
    },
  };

  const jwtService = {
    signAsync: vi.fn(),
  };

  const configService = {
    getOrThrow: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DatabaseProvider, useValue: database },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('creates a user with a hashed password and returns an access token', async () => {
      const insertedUser = {
        id: 'user-1',
        name: 'Mostafa',
        email: 'mostafa@example.com',
      };

      database.db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      database.db.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([insertedUser]),
        }),
      });

      jwtService.signAsync.mockResolvedValue('access-token');

      const result = await service.register(
        'Mostafa',
        'MOSTAFA@example.com',
        'strong-password',
      );

      expect(database.db.insert).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: insertedUser.id,
        email: insertedUser.email,
      });

      expect(result).toEqual({
        user: insertedUser,
        accessToken: 'access-token',
        refreshToken: expect.any(String),
      });

      expect(result.refreshToken).toHaveLength(43);

      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('rejects an already registered email', async () => {
      database.db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: 'user-1' }]),
        }),
      });

      await expect(
        service.register('Mostafa', 'mostafa@example.com', 'password'),
      ).rejects.toThrow(ConflictException);

      expect(database.db.insert).not.toHaveBeenCalled();
    });

    it('rejects duplicate emails when concurrent registrations race', async () => {
      database.db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const databaseError = Object.assign(new Error('Duplicate email'), {
        code: '23505',
        constraint: 'users_email_unique',
      });

      database.db.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockRejectedValue(databaseError),
        }),
      });

      await expect(
        service.register('Mostafa', 'mostafa@example.com', 'password'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('returns an access token when credentials are valid', async () => {
      const passwordHash = await argon2.hash('strong-password');

      database.db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'user-1',
              name: 'Mostafa',
              email: 'mostafa@example.com',
              passwordHash,
            },
          ]),
        }),
      });

      jwtService.signAsync.mockResolvedValue('access-token');

      const result = await service.login(
        'MOSTAFA@example.com',
        'strong-password',
      );

      expect(result).toEqual({
        user: {
          id: 'user-1',
          name: 'Mostafa',
          email: 'mostafa@example.com',
        },
        accessToken: 'access-token',
        refreshToken: expect.any(String),
      });

      expect(result.refreshToken).toHaveLength(43);

      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('rejects an unknown email', async () => {
      database.db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await expect(
        service.login('unknown@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects an incorrect password', async () => {
      const passwordHash = await argon2.hash('correct-password');

      database.db.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: 'user-1',
              name: 'Mostafa',
              email: 'mostafa@example.com',
              passwordHash,
            },
          ]),
        }),
      });

      await expect(
        service.login('mostafa@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('rotates a valid refresh token', async () => {
      const oldToken = 'old-refresh-token';
      const storedToken = {
        id: 'token-1',
        userId: 'user-1',
        tokenHash: 'placeholder',
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: null,
        createdAt: new Date(),
      };

      const user = {
        id: 'user-1',
        name: 'Mostafa',
        email: 'mostafa@example.com',
      };

      const tx = {
        select: vi.fn(),
        update: vi.fn(),
        insert: vi.fn(),
      };

      tx.select
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([storedToken]),
          }),
        })
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([user]),
          }),
        });

      tx.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ userId: 'user-1' }]),
          }),
        }),
      });

      tx.insert.mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      });

      database.db.transaction = vi.fn(async (callback) => callback(tx));

      jwtService.signAsync.mockResolvedValue('new-access-token');

      const result = await service.refresh(oldToken);

      expect(result.user).toEqual(user);
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBeTruthy();
      expect(result.refreshToken).not.toBe(oldToken);
      expect(tx.update).toHaveBeenCalled();
      expect(tx.insert).toHaveBeenCalled();
    });

    it('rejects a missing refresh token', async () => {
      await expect(service.refresh('')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(database.db.transaction).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('does nothing when no refresh token is supplied', async () => {
      await expect(service.logout(undefined)).resolves.toBeUndefined();
      expect(database.db.update).not.toHaveBeenCalled();
    });
  });

});
