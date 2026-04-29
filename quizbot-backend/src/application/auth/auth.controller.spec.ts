import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
  };

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    controller = new AuthController(authService as any);
  });

  it('forwards register requests to the auth service', async () => {
    const dto = { email: 'user@example.com', password: 'secret123' };
    authService.register.mockResolvedValue({ id: 1, email: dto.email });

    await controller.register(dto as any);

    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('forwards login requests to the auth service', async () => {
    const dto = { email: 'user@example.com', password: 'secret123' };
    authService.login.mockResolvedValue({ token: 'jwt-token' });

    await controller.login(dto as any);

    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
