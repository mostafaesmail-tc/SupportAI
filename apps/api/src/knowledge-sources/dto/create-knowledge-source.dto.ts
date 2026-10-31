import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateKnowledgeSourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}