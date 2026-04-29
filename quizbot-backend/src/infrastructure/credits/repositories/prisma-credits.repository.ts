import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ICreditsRepository } from '../../../domain/credits/credits.repository.interface';
import { Credit, GuestCreditUsage } from '@prisma/client';

/**
 * Concrete implementation of ICreditsRepository using Prisma.
 */
@Injectable()
export class PrismaCreditsRepository implements ICreditsRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: number): Promise<Credit | null> {
    return this.prisma.credit.findUnique({ where: { userId } });
  }

  async updateBalance(userId: number, amount: number): Promise<Credit> {
    return this.prisma.credit.update({
      where: { userId },
      data: { amount },
    });
  }

  async findGuestUsage(
    guestId: string,
    usageDay: string,
  ): Promise<GuestCreditUsage | null> {
    return this.prisma.guestCreditUsage.findUnique({
      where: {
        guestId_usageDay: {
          guestId,
          usageDay,
        },
      },
    });
  }

  async createGuestUsage(
    guestId: string,
    usageDay: string,
    quizCount: number,
  ): Promise<GuestCreditUsage> {
    return this.prisma.guestCreditUsage.create({
      data: {
        guestId,
        usageDay,
        quizCount,
      },
    });
  }

  async updateGuestUsage(
    guestId: string,
    usageDay: string,
    quizCount: number,
  ): Promise<GuestCreditUsage> {
    return this.prisma.guestCreditUsage.update({
      where: {
        guestId_usageDay: {
          guestId,
          usageDay,
        },
      },
      data: { quizCount },
    });
  }
}
