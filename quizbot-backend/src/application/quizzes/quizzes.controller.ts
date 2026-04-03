import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { QuizzesService } from '../../domain/quizzes/quizzes.service';

/**
 * QuizzesController defines the API endpoints for quiz actions.
 */
@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('generate')
  async generate(@Request() req) {
    return this.quizzesService.generateQuiz(req.user.userId);
  }
}
