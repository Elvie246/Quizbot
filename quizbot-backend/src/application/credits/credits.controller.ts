import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CreditsService } from '../../domain/credits/credits.service';

/**
 * CreditsController defines the API endpoints for credit management.
 */
@Controller('credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    const balance = await this.creditsService.getBalance(req.user.userId);
    return { balance };
  }
}
