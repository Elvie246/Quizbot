import { InternalServerErrorException } from '@nestjs/common';
import { AIService } from './ai.service';

describe('AIService', () => {
  let service: AIService;
  let model: {
    generateContent: jest.Mock;
  };

  beforeEach(() => {
    service = new AIService({
      get: jest.fn().mockReturnValue('test-api-key'),
    } as any);

    model = {
      generateContent: jest.fn(),
    };

    (service as any).model = model;
  });

  it('parses JSON responses even when the AI wraps them in markdown fences', async () => {
    model.generateContent.mockResolvedValue({
      response: {
        text: () =>
          '```json\n{"title":"Biology","description":"Basics","questions":[]}\n```',
      },
    });

    await expect(service.generateQuiz('Biology', 5)).resolves.toEqual({
      title: 'Biology',
      description: 'Basics',
      questions: [],
    });
  });

  it('maps quota errors to a friendly server message', async () => {
    model.generateContent.mockRejectedValue({
      status: 429,
    });

    await expect(service.generateQuiz('Biology', 5)).rejects.toThrow(
      new InternalServerErrorException('Gemini API quota exceeded. Please wait a minute.'),
    );
  });
});
