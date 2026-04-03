import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { UsersModule } from './infrastructure/users/users.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { CreditsModule } from './infrastructure/credits/credits.module';

/**
 * AppModule is the root module of the application.
 * It imports all the necessary modules for the application to function.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make configuration available globally
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CreditsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
