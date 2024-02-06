import { IsNotEmpty, IsNumber } from 'class-validator';

// [meta] Front -> Back
export class MetaToBackDto {

  // 페이지네이션을 위한 커서 ID
  @IsNotEmpty()
  @IsNumber()
  take: number;

  // 페이지당 불러올 limit 값
  @IsNotEmpty()
  @IsNumber()
  cursor: number;
  
}