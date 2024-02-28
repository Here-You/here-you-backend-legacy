import { IsInt } from 'class-validator';

export class MonthInfoDto {
  @IsInt()
  year: number;
  @IsInt()
  month: number;
}
