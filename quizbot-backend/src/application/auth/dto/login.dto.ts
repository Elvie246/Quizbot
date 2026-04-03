import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * LoginDto defines the data structure for user login.
 */
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
