import { Quiz, Question, Option } from '@prisma/client';

/**
 * Interface for Quiz persistence in the domain layer.
 */
export interface IQuizzesRepository {
  create(userId: number, data: any): Promise<Quiz>;
  findAllByUserId(userId: number): Promise<Quiz[]>;
  findById(id: number): Promise<Quiz | null>;
}
