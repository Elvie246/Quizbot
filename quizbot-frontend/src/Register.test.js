import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Register from './Register';

describe('Register', () => {
  const originalAlert = window.alert;
  const originalFetch = global.fetch;

  beforeEach(() => {
    window.alert = jest.fn();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    window.alert = originalAlert;
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('shows an error when passwords do not match', () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('alerts success and notifies the parent when registration succeeds', async () => {
    const onRegister = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        email: 'user@example.com',
      }),
    });

    render(<Register onRegister={onRegister} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(onRegister).toHaveBeenCalledWith({ id: 1, email: 'user@example.com' }));
    expect(window.alert).toHaveBeenCalledWith('Registration successful! You can now login.');
  });

  it('shows the backend error message when registration fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'User with this email already exists',
      }),
    });

    render(<Register />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByText(/user with this email already exists/i)).toBeInTheDocument(),
    );
  });
});
