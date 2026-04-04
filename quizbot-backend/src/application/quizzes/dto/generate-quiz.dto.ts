import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator';

/**
 * GenerateQuizDto defines the payload for creating a new quiz.
 */
export class GenerateQuizDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  questionCount?: number = 5;
}
