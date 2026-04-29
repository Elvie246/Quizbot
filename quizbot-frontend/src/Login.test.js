import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from './Login';

describe('Login', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('shows a validation error when fields are missing', () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('stores the token and notifies the parent when login succeeds', async () => {
    const onLogin = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'jwt-token',
        user: { id: 1, email: 'user@example.com' },
      }),
    });

    render(<Login onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(onLogin).toHaveBeenCalledWith({ id: 1, email: 'user@example.com' }));
    expect(localStorage.getItem('jwtToken')).toBe('jwt-token');
  });

  it('shows the backend error message when login fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Invalid credentials',
      }),
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument(),
    );
  });
});
