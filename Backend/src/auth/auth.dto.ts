
import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
  
  @IsNotEmpty()
  role: string;  // added role to the DTO
}

export class JwtPayload {
  username: string;
  sub: number;
  role: string;
}

