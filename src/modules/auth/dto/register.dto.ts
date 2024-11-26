import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  FullName: string;
  @IsEmail()
  @IsNotEmpty()
  Email: string;
  @IsNotEmpty()
  CompanyName: string;
  @IsNotEmpty({ message: 'Please enter a password' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  Password: string;
  isActive: boolean;
  code_id: string;
  code_expired: Date;
}
