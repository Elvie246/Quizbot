import { Controller, Post, Get, Body, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { QuizzesService } from '../../domain/quizzes/quizzes.service';
import { GenerateQuizDto } from './dto/generate-quiz.dto';

/**
 * QuizzesController defines the API endpoints for quiz actions.
 */
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Request() req, @Body() dto: GenerateQuizDto) {
    return this.quizzesService.generateQuiz(req.user.userId, dto);
  }

  @Post('generate-public')
  async generatePublic(@Body() dto: GenerateQuizDto) {
    return this.quizzesService.generatePublic(dto);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Request() req) {
    return this.quizzesService.getUserHistory(req.user.userId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.getQuizById(id);
  }
}
