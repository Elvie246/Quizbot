import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * RegisterDto defines the data structure for user registration.
 */
export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
