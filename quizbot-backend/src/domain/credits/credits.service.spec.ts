import { ForbiddenException } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { ICreditsRepository } from './credits.repository.interface';

describe('CreditsService', () => {
  let service: CreditsService;
  let creditsRepository: jest.Mocked<ICreditsRepository>;

  beforeEach(() => {
    creditsRepository = {
      findByUserId: jest.fn(),
      updateBalance: jest.fn(),
      findGuestUsage: jest.fn(),
      createGuestUsage: jest.fn(),
      updateGuestUsage: jest.fn(),
    };

    service = new CreditsService(creditsRepository);
  });

  it('returns an authenticated summary that blocks generation at zero balance', async () => {
    creditsRepository.findByUserId.mockResolvedValue({
      amount: 0,
    } as any);

    await expect(service.getUserCreditSummary(42)).resolves.toEqual({
      mode: 'authenticated',
      balance: 0,
      costPerQuiz: 1,
      canGenerate: false,
    });
  });

  it('rejects guest generation once the daily limit is reached', async () => {
    creditsRepository.findGuestUsage.mockResolvedValue({
      quizCount: 2,
    } as any);

    await expect(service.ensureGuestCanGenerateQuiz('guest-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('creates the first guest usage record and returns the updated guest summary', async () => {
    creditsRepository.findGuestUsage
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        quizCount: 1,
      } as any);
    creditsRepository.createGuestUsage.mockResolvedValue({
      quizCount: 1,
    } as any);

    const summary = await service.registerGuestQuizGeneration('guest-1');

    expect(creditsRepository.createGuestUsage).toHaveBeenCalledWith(
      'guest-1',
      expect.any(String),
      1,
    );
    expect(summary).toMatchObject({
      mode: 'guest',
      dailyLimit: 2,
      used: 1,
      remaining: 1,
      canGenerate: true,
    });
  });
});
