import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

// [meta] Back -> Front
export class MetaToFrontDto {
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsNumber()
  take: number;

  @IsNotEmpty()
  @IsBoolean()
  hasNextData: boolean;

  @IsNotEmpty()
  @IsNumber()
  cursor: number;
}