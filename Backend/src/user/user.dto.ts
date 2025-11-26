// src/user/dto/user.dto.ts
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsOptional() 
  @IsString()
  address?: string; // Optional
}
