import { Credit } from '@prisma/client';

/**
 * Interface for Credit management in the domain layer.
 */
export interface ICreditsRepository {
  findByUserId(userId: number): Promise<Credit | null>;
  updateBalance(userId: number, amount: number): Promise<Credit>;
}
