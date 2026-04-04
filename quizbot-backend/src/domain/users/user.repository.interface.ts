import { User } from '@prisma/client';

/**
 * Interface for User management in the domain layer.
 */
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: any): Promise<User>;
  findById(id: number): Promise<User | null>;
}
