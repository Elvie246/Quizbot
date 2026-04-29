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
    // 1. Ensure the user still has enough credits before calling the AI provider.
    await this.creditsService.ensureUserCanGenerateQuiz(userId);

    // 2. Generate quiz with AI
    const aiQuiz = await this.aiService.generateQuiz(dto.topic, dto.questionCount);

    // 3. Persist quiz in database
    const savedQuiz = await this.quizzesRepository.create(userId, aiQuiz);

    // 4. Charge the user only after the quiz has been generated and stored.
    await this.creditsService.consumeQuizGenerationCredit(userId);

    return savedQuiz;
  }

  /**
   * Generates a quiz without persisting it (for guest users).
   */
  async generatePublic(guestId: string, dto: GenerateQuizDto) {
    await this.creditsService.ensureGuestCanGenerateQuiz(guestId);

    const aiQuiz = await this.aiService.generateQuiz(dto.topic, dto.questionCount);
    const publicQuiz = this.attachTransientIdentifiers(aiQuiz);

    await this.creditsService.registerGuestQuizGeneration(guestId);

    return publicQuiz;
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

  /**
   * Public quizzes are not stored in the database, so they need transient numeric ids
   * for the frontend quiz player.
   */
  private attachTransientIdentifiers(aiQuiz: any) {
    return {
      id: 0,
      title: aiQuiz.title,
      description: aiQuiz.description,
      questions: aiQuiz.questions.map((question: any, questionIndex: number) => ({
        id: questionIndex + 1,
        text: question.text,
        options: question.options.map((option: any, optionIndex: number) => ({
          id: questionIndex * 100 + optionIndex + 1,
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      })),
    };
  }
}
