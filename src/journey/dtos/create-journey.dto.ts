// create-journey.dto.ts
import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateJourneyDto {
  @IsNumber()
  userId: number;

  @IsString()
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
