import {
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  minLength,
  MinLength,
  Length,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  id: string;
  @IsOptional()
  @Length(6)
  FullName: string;
  @IsEmail()
  @IsOptional()
  Email: string;
  @IsOptional()
  CompanyName: string;
  @IsOptional()
  Password: string;
  @IsOptional()
  Address: string;
  @IsOptional()
  ImgUser: string;
  @IsOptional()
  ImgCover: string;
}
