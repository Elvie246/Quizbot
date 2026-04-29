import { Controller, Get, Headers, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CreditsService } from '../../domain/credits/credits.service';

/**
 * CreditsController defines the API endpoints for credit management.
 */
@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@Request() req) {
    return this.creditsService.getUserCreditSummary(req.user.userId);
  }

  @Get('public-balance')
  async getPublicBalance(@Headers('x-guest-id') guestId: string) {
    return this.creditsService.getGuestCreditSummary(guestId);
  }
}
