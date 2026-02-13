import { IsString } from 'class-validator';

export class CreatePromptDto {
  @IsString()
  text: string;

  @IsString()
  version: string;
}
