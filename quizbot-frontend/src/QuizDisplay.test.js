import { fireEvent, render, screen } from '@testing-library/react';
import QuizDisplay from './QuizDisplay';

const sampleQuiz = {
  id: 1,
  title: 'Biology Basics',
  description: 'A short quiz about biology.',
  questions: [
    {
      id: 10,
      text: 'What powers the cell?',
      options: [
        { id: 100, text: 'Mitochondria', isCorrect: true },
        { id: 101, text: 'Ribosome', isCorrect: false },
      ],
    },
    {
      id: 11,
      text: 'What carries genetic information?',
      options: [
        { id: 110, text: 'DNA', isCorrect: true },
        { id: 111, text: 'Water', isCorrect: false },
      ],
    },
  ],
};

describe('QuizDisplay', () => {
  it('disables submit until every question has an answer', () => {
    render(<QuizDisplay quiz={sampleQuiz} />);

    const submitButton = screen.getByRole('button', { name: /submit quiz/i });
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByLabelText('Mitochondria'));
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByLabelText('DNA'));
    expect(submitButton).toBeEnabled();
  });

  it('shows the score after submission and lets the user try again', () => {
    render(<QuizDisplay quiz={sampleQuiz} />);

    fireEvent.click(screen.getByLabelText('Mitochondria'));
    fireEvent.click(screen.getByLabelText('Water'));
    fireEvent.click(screen.getByRole('button', { name: /submit quiz/i }));

    expect(screen.getByText(/your score: 1 \/ 2/i)).toBeInTheDocument();
    expect(screen.getByText(/good job! keep studying/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByRole('button', { name: /submit quiz/i })).toBeDisabled();
  });
});
