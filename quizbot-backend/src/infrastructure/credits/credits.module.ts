import { Module } from '@nestjs/common';
import { CreditsService } from '../../domain/credits/credits.service';
import { CreditsController } from '../../application/credits/credits.controller';
import { PrismaCreditsRepository } from '../../infrastructure/credits/repositories/prisma-credits.repository';

/**
 * CreditsModule integrates the domain and infrastructure layers for Credits.
 */
@Module({
  providers: [
    CreditsService,
    {
      provide: 'ICreditsRepository',
      useClass: PrismaCreditsRepository,
    },
  ],
  controllers: [CreditsController],
  exports: [CreditsService],
})
export class CreditsModule {}
