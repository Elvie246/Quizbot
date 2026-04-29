import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserRepository } from '../../../domain/users/user.repository.interface';
import { User } from '@prisma/client';
import { INITIAL_USER_CREDITS } from '../../../domain/credits/credits.constants';

/**
 * Concrete implementation of IUserRepository using Prisma.
 */
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: any): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        credits: {
          create: { amount: INITIAL_USER_CREDITS },
        },
      },
      include: { credits: true },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
