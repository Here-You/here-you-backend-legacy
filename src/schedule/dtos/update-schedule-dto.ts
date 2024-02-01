// Update-schedule.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class UpdateScheduleDto {
  @IsString()
  title: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
