import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import QuizbotGeneratorCard from './QuizbotGeneratorCard';

describe('QuizbotGeneratorCard', () => {
  const originalAlert = window.alert;
  const originalFetch = global.fetch;
  const originalLog = console.log;

  beforeEach(() => {
    window.alert = jest.fn();
    global.fetch = jest.fn();
    console.log = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    window.alert = originalAlert;
    global.fetch = originalFetch;
    console.log = originalLog;
    jest.clearAllMocks();
  });

  it('rejects whitespace-only submissions', async () => {
    render(<QuizbotGeneratorCard isLoggedIn={false} />);

    fireEvent.change(screen.getByLabelText(/paste your text here/i), {
      target: { value: '   ' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate quiz/i }));

    expect(window.alert).toHaveBeenCalledWith('Please enter some text or upload a document.');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('rejects unsupported binary files before generation', async () => {
    const { container } = render(<QuizbotGeneratorCard isLoggedIn={false} />);

    const fileInput = container.querySelector('input[type="file"]');
    const unsupportedFile = new File(['%PDF'], 'course.pdf', {
      type: 'application/pdf',
    });

    fireEvent.change(fileInput, {
      target: {
        files: [unsupportedFile],
      },
    });

    expect(window.alert).toHaveBeenCalledWith(
      'Only .txt and .md files are currently supported for quiz generation.',
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('blocks authenticated users without enough credits', async () => {
    localStorage.setItem('jwtToken', 'token-123');

    render(
      <QuizbotGeneratorCard
        isLoggedIn={true}
        creditsSummary={{
          mode: 'authenticated',
          balance: 0,
          costPerQuiz: 1,
          canGenerate: false,
        }}
      />,
    );

    fireEvent.change(screen.getByLabelText(/paste your text here/i), {
      target: { value: 'Biology basics' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate quiz/i }));

    expect(window.alert).toHaveBeenCalledWith(
      'You do not have enough credits to generate another quiz.',
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends the guest header, shows a loading state, and normalizes generated quizzes', async () => {
    let resolveFetch;
    const onQuizGenerated = jest.fn();
    localStorage.setItem('quizbotGuestId', 'guest-123');
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );

    render(
      <QuizbotGeneratorCard
        isLoggedIn={false}
        creditsSummary={{
          mode: 'guest',
          dailyLimit: 2,
          used: 0,
          remaining: 2,
          canGenerate: true,
          resetAt: '2026-05-01T00:00:00.000Z',
        }}
        onQuizGenerated={onQuizGenerated}
      />,
    );

    fireEvent.change(screen.getByLabelText(/paste your text here/i), {
      target: { value: 'Photosynthesis' },
    });
    fireEvent.click(screen.getByRole('button', { name: /generate quiz/i }));

    expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/quizzes/generate-public',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Guest-Id': 'guest-123',
        }),
      }),
    );

    resolveFetch({
      ok: true,
      json: async () => ({
        title: 'Photosynthesis Quiz',
        description: 'A short quiz about photosynthesis.',
        questions: [
          {
            text: 'What does chlorophyll do?',
            options: [
              { text: 'Captures light', isCorrect: true },
              { text: 'Stores blood', isCorrect: false },
            ],
          },
        ],
      }),
    });

    await waitFor(() => expect(onQuizGenerated).toHaveBeenCalledTimes(1));
    expect(onQuizGenerated).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 0,
        questions: [
          expect.objectContaining({
            id: 1,
            options: [
              expect.objectContaining({ id: 1 }),
              expect.objectContaining({ id: 2 }),
            ],
          }),
        ],
      }),
    );
  });
});
