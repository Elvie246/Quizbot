import { QuizzesService } from './quizzes.service';

describe('QuizzesService', () => {
  let service: QuizzesService;
  let creditsService: {
    ensureUserCanGenerateQuiz: jest.Mock;
    consumeQuizGenerationCredit: jest.Mock;
    ensureGuestCanGenerateQuiz: jest.Mock;
    registerGuestQuizGeneration: jest.Mock;
  };
  let aiService: {
    generateQuiz: jest.Mock;
  };
  let quizzesRepository: {
    create: jest.Mock;
    findAllByUserId: jest.Mock;
    findById: jest.Mock;
  };

  const generatedQuiz = {
    title: 'Biology Basics',
    description: 'Introductory biology quiz.',
    questions: [
      {
        text: 'What is the powerhouse of the cell?',
        options: [
          { text: 'Mitochondria', isCorrect: true },
          { text: 'Nucleus', isCorrect: false },
          { text: 'Ribosome', isCorrect: false },
          { text: 'Membrane', isCorrect: false },
        ],
      },
    ],
  };

  beforeEach(() => {
    creditsService = {
      ensureUserCanGenerateQuiz: jest.fn(),
      consumeQuizGenerationCredit: jest.fn(),
      ensureGuestCanGenerateQuiz: jest.fn(),
      registerGuestQuizGeneration: jest.fn(),
    };

    aiService = {
      generateQuiz: jest.fn(),
    };

    quizzesRepository = {
      create: jest.fn(),
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
    };

    service = new QuizzesService(
      creditsService as any,
      aiService as any,
      quizzesRepository as any,
    );
  });

  it('charges authenticated users after the quiz has been persisted', async () => {
    aiService.generateQuiz.mockResolvedValue(generatedQuiz);
    quizzesRepository.create.mockResolvedValue({
      id: 5,
      ...generatedQuiz,
    });

    await service.generateQuiz(7, {
      topic: 'Cells',
      questionCount: 1,
    });

    expect(creditsService.ensureUserCanGenerateQuiz).toHaveBeenCalledWith(7);
    expect(quizzesRepository.create).toHaveBeenCalledWith(7, generatedQuiz);
    expect(creditsService.consumeQuizGenerationCredit).toHaveBeenCalledWith(7);
    expect(quizzesRepository.create.mock.invocationCallOrder[0]).toBeLessThan(
      creditsService.consumeQuizGenerationCredit.mock.invocationCallOrder[0],
    );
  });

  it('adds transient ids to public quizzes before returning them', async () => {
    aiService.generateQuiz.mockResolvedValue(generatedQuiz);
    creditsService.registerGuestQuizGeneration.mockResolvedValue({
      mode: 'guest',
      remaining: 1,
    });

    const publicQuiz = await service.generatePublic('guest-42', {
      topic: 'Cells',
      questionCount: 1,
    });

    expect(creditsService.ensureGuestCanGenerateQuiz).toHaveBeenCalledWith('guest-42');
    expect(creditsService.registerGuestQuizGeneration).toHaveBeenCalledWith('guest-42');
    expect(publicQuiz).toMatchObject({
      id: 0,
      title: 'Biology Basics',
    });
    expect(publicQuiz.questions[0].id).toBe(1);
    expect(publicQuiz.questions[0].options[0].id).toBe(1);
  });
});
