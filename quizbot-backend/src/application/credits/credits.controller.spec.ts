import { CreditsController } from './credits.controller';

describe('CreditsController', () => {
  let controller: CreditsController;
  let creditsService: {
    getUserCreditSummary: jest.Mock;
    getGuestCreditSummary: jest.Mock;
  };

  beforeEach(() => {
    creditsService = {
      getUserCreditSummary: jest.fn(),
      getGuestCreditSummary: jest.fn(),
    };

    controller = new CreditsController(creditsService as any);
  });

  it('returns the authenticated credit summary for the current user', async () => {
    creditsService.getUserCreditSummary.mockResolvedValue({
      mode: 'authenticated',
      balance: 3,
      costPerQuiz: 1,
      canGenerate: true,
    });

    await controller.getBalance({ user: { userId: 42 } });

    expect(creditsService.getUserCreditSummary).toHaveBeenCalledWith(42);
  });

  it('returns the guest credit summary for the provided guest header', async () => {
    creditsService.getGuestCreditSummary.mockResolvedValue({
      mode: 'guest',
      dailyLimit: 2,
      used: 1,
      remaining: 1,
      canGenerate: true,
      resetAt: '2026-05-01T00:00:00.000Z',
    });

    await controller.getPublicBalance('guest-123');

    expect(creditsService.getGuestCreditSummary).toHaveBeenCalledWith('guest-123');
  });
});
