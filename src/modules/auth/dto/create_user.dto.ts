import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
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
  @IsNotEmpty()
  Address: string;
  @IsNotEmpty()
  ImgUser: string;
  @IsNotEmpty()
  ImgCover: string;
}
