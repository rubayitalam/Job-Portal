import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateArticleDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
