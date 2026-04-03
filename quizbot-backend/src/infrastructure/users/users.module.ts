import { Module } from '@nestjs/common';
import { UsersService } from '../../domain/users/users.service';
import { PrismaUserRepository } from '../../infrastructure/users/repositories/prisma-user.repository';

/**
 * UsersModule integrates the domain and infrastructure layers for Users.
 */
@Module({
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
