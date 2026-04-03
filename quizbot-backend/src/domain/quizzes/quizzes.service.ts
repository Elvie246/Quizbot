import { Injectable } from '@nestjs/common';
import { CreditsService } from '../credits/credits.service';

/**
 * QuizzesService manages business logic for Quizzes.
 */
@Injectable()
export class QuizzesService {
  constructor(private readonly creditsService: CreditsService) {}

  /**
   * Simulate quiz generation that costs 1 credit.
   */
  async generateQuiz(userId: number) {
    // 1. Check and deduct 1 credit (throws ForbiddenException if balance is 0)
    await this.creditsService.deductCredits(userId, 1);

    // 2. Placeholder for actual quiz generation logic
    return {
      message: 'Quiz generated successfully',
      quiz: {
        id: Math.floor(Math.random() * 1000),
        title: 'Random Sample Quiz',
        questions: []
      }
    };
  }
}
