import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IQuizzesRepository } from '../../../domain/quizzes/quizzes.repository.interface';
import { Quiz } from '@prisma/client';

/**
 * Concrete implementation of IQuizzesRepository using Prisma.
 */
@Injectable()
export class PrismaQuizzesRepository implements IQuizzesRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: any): Promise<Quiz> {
    return this.prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        userId: userId,
        questions: {
          create: data.questions.map((q: any) => ({
            text: q.text,
            options: {
              create: q.options.map((o: any) => ({
                text: o.text,
                isCorrect: o.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
  }

  async findAllByUserId(userId: number): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: { userId },
      include: {
        questions: {
          include: { options: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<Quiz | null> {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
  }
}
