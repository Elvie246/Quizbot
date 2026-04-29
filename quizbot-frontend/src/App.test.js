import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

const originalFetch = global.fetch;
const originalWarn = console.warn;

afterEach(() => {
  global.fetch = originalFetch;
  console.warn = originalWarn;
});

test('renders the public homepage and loads the guest credits summary', async () => {
  console.warn = jest.fn();
  global.fetch = jest.fn(async (url) => {
    if (url === 'http://localhost:3000/api/credits/public-balance') {
      return {
        ok: true,
        json: async () => ({
          mode: 'guest',
          dailyLimit: 2,
          used: 0,
          remaining: 2,
          canGenerate: true,
          resetAt: '2026-05-01T00:00:00.000Z',
        }),
      };
    }

    return {
      ok: true,
      json: async () => [],
    };
  });

  render(<App />);

  expect(screen.getByText(/welcome to quizbot/i)).toBeInTheDocument();

  await waitFor(() =>
    expect(
      screen.getByText(/guest access: 2 of 2 quiz generations remaining today/i),
    ).toBeInTheDocument(),
  );
});
