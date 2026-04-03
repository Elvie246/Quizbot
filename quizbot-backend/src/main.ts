import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Main function to bootstrap the application.
 * Sets up global pipes and CORS.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove any extra fields from the body
    forbidNonWhitelisted: true, // Throw an error if extra fields are provided
    transform: true, // Automatically transform payloads to DTO instances
  }));

  // Enable CORS for frontend communication
  app.enableCors({
    origin: '*', // Adjust this to your frontend URL in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
