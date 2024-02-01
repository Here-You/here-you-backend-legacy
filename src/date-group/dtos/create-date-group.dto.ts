// create-journey.dto.ts
import { IsDateString } from 'class-validator';

export class CreateDateGroupDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
