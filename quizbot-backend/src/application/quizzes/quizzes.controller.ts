import { Controller, Post, Get, Body, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { QuizzesService } from '../../domain/quizzes/quizzes.service';
import { GenerateQuizDto } from './dto/generate-quiz.dto';

/**
 * QuizzesController defines the API endpoints for quiz actions.
 */
@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('generate')
  async generate(@Request() req, @Body() dto: GenerateQuizDto) {
    return this.quizzesService.generateQuiz(req.user.userId, dto);
  }

  @Get('history')
  async getHistory(@Request() req) {
    return this.quizzesService.getUserHistory(req.user.userId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.getQuizById(id);
  }
}
