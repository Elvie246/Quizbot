import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from './user.repository.interface';
import { User } from '@prisma/client';

/**
 * UsersService manages business logic for Users.
 * Follows the domain-driven design.
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(data: any): Promise<User> {
    return this.userRepository.create(data);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
