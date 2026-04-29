import { Credit, GuestCreditUsage } from '@prisma/client';

/**
 * Interface for Credit management in the domain layer.
 */
export interface ICreditsRepository {
  findByUserId(userId: number): Promise<Credit | null>;
  updateBalance(userId: number, amount: number): Promise<Credit>;
  findGuestUsage(guestId: string, usageDay: string): Promise<GuestCreditUsage | null>;
  createGuestUsage(
    guestId: string,
    usageDay: string,
    quizCount: number,
  ): Promise<GuestCreditUsage>;
  updateGuestUsage(
    guestId: string,
    usageDay: string,
    quizCount: number,
  ): Promise<GuestCreditUsage>;
}
