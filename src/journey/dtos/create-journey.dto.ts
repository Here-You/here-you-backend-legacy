// create-journey.dto.ts
import { IsDateString } from 'class-validator';

export class CreateJourneyDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
