import { IsInt } from 'class-validator';

export class FindMonthlyJourneyDto {
  @IsInt()
  year: number;
  @IsInt()
  month: number;
}
