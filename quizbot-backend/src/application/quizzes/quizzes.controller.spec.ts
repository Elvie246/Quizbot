import { QuizzesController } from './quizzes.controller';

describe('QuizzesController', () => {
  let controller: QuizzesController;
  let quizzesService: {
    generateQuiz: jest.Mock;
    generatePublic: jest.Mock;
    getUserHistory: jest.Mock;
    getQuizById: jest.Mock;
  };

  beforeEach(() => {
    quizzesService = {
      generateQuiz: jest.fn(),
      generatePublic: jest.fn(),
      getUserHistory: jest.fn(),
      getQuizById: jest.fn(),
    };

    controller = new QuizzesController(quizzesService as any);
  });

  it('forwards authenticated generation requests to the domain service', async () => {
    const dto = { topic: 'Cells', questionCount: 10 };
    quizzesService.generateQuiz.mockResolvedValue({ id: 1 });

    await controller.generate({ user: { userId: 99 } }, dto as any);

    expect(quizzesService.generateQuiz).toHaveBeenCalledWith(99, dto);
  });

  it('forwards guest generation requests with the guest header', async () => {
    const dto = { topic: 'Cells', questionCount: 10 };
    quizzesService.generatePublic.mockResolvedValue({ id: 0 });

    await controller.generatePublic('guest-123', dto as any);

    expect(quizzesService.generatePublic).toHaveBeenCalledWith('guest-123', dto);
  });

  it('forwards history and quiz lookup requests', async () => {
    await controller.getHistory({ user: { userId: 10 } });
    await controller.getById(5);

    expect(quizzesService.getUserHistory).toHaveBeenCalledWith(10);
    expect(quizzesService.getQuizById).toHaveBeenCalledWith(5);
  });
});
