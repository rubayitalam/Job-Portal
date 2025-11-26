import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTemplateDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  filecontent: string;
}
