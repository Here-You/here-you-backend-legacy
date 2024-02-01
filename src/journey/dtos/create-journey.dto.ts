// create-journey.dto.ts
import { IsString, IsDateString } from 'class-validator';

export class CreateJourneyDto {
  @IsString()
  journey_title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
