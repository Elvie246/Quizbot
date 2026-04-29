import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findByEmail: jest.Mock;
    create: jest.Mock;
  };
  let jwtService: {
    signAsync: jest.Mock;
  };
  const originalConsoleError = console.error;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    service = new AuthService(usersService as any, jwtService as any);
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    jest.restoreAllMocks();
  });

  it('rejects registration when the email already exists', async () => {
    usersService.findByEmail.mockResolvedValue({ id: 1, email: 'user@example.com' });

    await expect(
      service.register({ email: 'user@example.com', password: 'secret123' } as any),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('hashes the password and removes it from the register response', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.create.mockResolvedValue({
      id: 7,
      email: 'new@example.com',
      password: 'hashed-password',
      credits: { amount: 10 },
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    await expect(
      service.register({ email: 'new@example.com', password: 'plain-password' } as any),
    ).resolves.toEqual({
      id: 7,
      email: 'new@example.com',
      credits: { amount: 10 },
    });
    expect(usersService.create).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'hashed-password',
    });
  });

  it('rejects login when the user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'missing@example.com', password: 'secret123' } as any),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects login when the password is invalid', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      password: 'stored-hash',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'user@example.com', password: 'wrong-password' } as any),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns a token and a sanitized user when login succeeds', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 4,
      email: 'user@example.com',
      password: 'stored-hash',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('jwt-token');

    await expect(
      service.login({ email: 'user@example.com', password: 'secret123' } as any),
    ).resolves.toEqual({
      token: 'jwt-token',
      user: {
        id: 4,
        email: 'user@example.com',
      },
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 4,
      email: 'user@example.com',
    });
  });
});
