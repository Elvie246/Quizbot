import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ICreditsRepository } from '../../../domain/credits/credits.repository.interface';
import { Credit } from '@prisma/client';

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
}
