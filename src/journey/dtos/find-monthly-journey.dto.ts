import { IsInt } from 'class-validator';

export class FindMonthlyScheduleDto {
  @IsInt()
  year: number;
  @IsInt()
  month: number;
}
