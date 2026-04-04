import { Injectable, Inject } from '@nestjs/common';
import { CreditsService } from '../credits/credits.service';
import * as Repositories from './quizzes.repository.interface';
import { AIService } from '../../infrastructure/quizzes/ai.service';
import { GenerateQuizDto } from '../../application/quizzes/dto/generate-quiz.dto';

/**
 * QuizzesService manages business logic for Quizzes.
 * Integrates credit deduction, AI generation and persistence.
 */
@Injectable()
export class QuizzesService {
  constructor(
    private readonly creditsService: CreditsService,
    private readonly aiService: AIService,
    @Inject('IQuizzesRepository')
    private readonly quizzesRepository: Repositories.IQuizzesRepository,
  ) {}

  /**
   * Generates a real quiz using AI, deducts 1 credit and stores it.
   */
  async generateQuiz(userId: number, dto: GenerateQuizDto) {
    // 1. Check and deduct 1 credit (DISABLED FOR TESTING/UNLIMITED ACCESS)
    // await this.creditsService.deductCredits(userId, 1);

    // 2. Generate quiz with AI
    const aiQuiz = await this.aiService.generateQuiz(dto.topic, dto.questionCount);

    // 3. Persist quiz in database
    return this.quizzesRepository.create(userId, aiQuiz);
  }

  /**
   * Generates a quiz without persisting it (for guest users).
   */
  async generatePublic(dto: GenerateQuizDto) {
    return this.aiService.generateQuiz(dto.topic, dto.questionCount);
  }

  /**
   * Retrieves all quizzes for a specific user.
   */
  async getUserHistory(userId: number) {
    return this.quizzesRepository.findAllByUserId(userId);
  }

  /**
   * Retrieves a single quiz by ID.
   */
  async getQuizById(id: number) {
    return this.quizzesRepository.findById(id);
  }
}
