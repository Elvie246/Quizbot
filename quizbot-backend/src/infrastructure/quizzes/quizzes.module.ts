import { Module } from '@nestjs/common';
import { QuizzesService } from '../../domain/quizzes/quizzes.service';
import { QuizzesController } from '../../application/quizzes/quizzes.controller';
import { CreditsModule } from '../credits/credits.module';

/**
 * QuizzesModule manages all features related to Quiz generation and history.
 */
@Module({
  imports: [CreditsModule],
  providers: [QuizzesService],
  controllers: [QuizzesController],
  exports: [QuizzesService],
})
export class QuizzesModule {}
