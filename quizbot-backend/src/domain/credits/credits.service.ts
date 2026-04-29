import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as Repositories from './credits.repository.interface';
import {
  GUEST_DAILY_QUIZ_LIMIT,
  QUIZ_GENERATION_COST,
} from './credits.constants';
import { GuestCreditsSummary, UserCreditsSummary } from './credits.types';

/**
 * CreditsService manages business logic for Credits.
 * Follows the domain-driven design.
 */
@Injectable()
export class CreditsService {
  constructor(
    @Inject('ICreditsRepository')
    private readonly creditsRepository: Repositories.ICreditsRepository,
  ) {}

  async getBalance(userId: number) {
    const credits = await this.creditsRepository.findByUserId(userId);
    if (!credits) {
      throw new NotFoundException('Credit record not found for this user');
    }
    return credits.amount;
  }

  async deductCredits(userId: number, amount: number) {
    const currentBalance = await this.getBalance(userId);
    if (currentBalance < amount) {
      throw new ForbiddenException('Insufficient credits to perform this action');
    }

    const newBalance = currentBalance - amount;
    return this.creditsRepository.updateBalance(userId, newBalance);
  }

  async addCredits(userId: number, amount: number) {
    const currentBalance = await this.getBalance(userId);
    const newBalance = currentBalance + amount;
    return this.creditsRepository.updateBalance(userId, newBalance);
  }

  async getUserCreditSummary(userId: number): Promise<UserCreditsSummary> {
    const balance = await this.getBalance(userId);

    return {
      mode: 'authenticated',
      balance,
      costPerQuiz: QUIZ_GENERATION_COST,
      canGenerate: balance >= QUIZ_GENERATION_COST,
    };
  }

  async ensureUserCanGenerateQuiz(userId: number) {
    const summary = await this.getUserCreditSummary(userId);
    if (!summary.canGenerate) {
      throw new ForbiddenException('At least 1 credit is required to generate a quiz');
    }
  }

  async consumeQuizGenerationCredit(userId: number) {
    return this.deductCredits(userId, QUIZ_GENERATION_COST);
  }

  async getGuestCreditSummary(guestId: string): Promise<GuestCreditsSummary> {
    const normalizedGuestId = this.normalizeGuestId(guestId);
    const usageDay = this.getUsageDay();
    const usage = await this.creditsRepository.findGuestUsage(normalizedGuestId, usageDay);
    const used = usage?.quizCount ?? 0;
    const remaining = Math.max(0, GUEST_DAILY_QUIZ_LIMIT - used);

    return {
      mode: 'guest',
      dailyLimit: GUEST_DAILY_QUIZ_LIMIT,
      used,
      remaining,
      canGenerate: remaining >= QUIZ_GENERATION_COST,
      resetAt: this.getNextResetAt(),
    };
  }

  async ensureGuestCanGenerateQuiz(guestId: string) {
    const summary = await this.getGuestCreditSummary(guestId);
    if (!summary.canGenerate) {
      throw new ForbiddenException(
        'Guest daily limit reached. Please sign in or try again tomorrow.',
      );
    }
  }

  async registerGuestQuizGeneration(guestId: string) {
    const normalizedGuestId = this.normalizeGuestId(guestId);
    const usageDay = this.getUsageDay();
    const usage = await this.creditsRepository.findGuestUsage(normalizedGuestId, usageDay);
    const nextUsageCount = (usage?.quizCount ?? 0) + QUIZ_GENERATION_COST;

    if (nextUsageCount > GUEST_DAILY_QUIZ_LIMIT) {
      throw new ForbiddenException(
        'Guest daily limit reached. Please sign in or try again tomorrow.',
      );
    }

    if (usage) {
      await this.creditsRepository.updateGuestUsage(
        normalizedGuestId,
        usageDay,
        nextUsageCount,
      );
    } else {
      await this.creditsRepository.createGuestUsage(
        normalizedGuestId,
        usageDay,
        nextUsageCount,
      );
    }

    return this.getGuestCreditSummary(normalizedGuestId);
  }

  /**
   * Guest usage is tracked per UTC day so every client follows the same reset time.
   */
  private getUsageDay(referenceDate: Date = new Date()) {
    return referenceDate.toISOString().slice(0, 10);
  }

  private getNextResetAt(referenceDate: Date = new Date()) {
    const nextUtcMidnight = new Date(
      Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth(),
        referenceDate.getUTCDate() + 1,
      ),
    );

    return nextUtcMidnight.toISOString();
  }

  private normalizeGuestId(guestId: string) {
    const normalizedGuestId = guestId?.trim();

    if (!normalizedGuestId) {
      throw new BadRequestException('Missing x-guest-id header');
    }

    return normalizedGuestId;
  }
}
