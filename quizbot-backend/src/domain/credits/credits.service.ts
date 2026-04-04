import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as Repositories from './credits.repository.interface';

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
}
