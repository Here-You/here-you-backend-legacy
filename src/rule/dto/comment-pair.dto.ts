import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';

export class CommentPairDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsDate()
  created: Date;

  @IsNotEmpty()
  @IsString()
  name: string;
}